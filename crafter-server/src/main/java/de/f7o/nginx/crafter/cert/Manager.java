package de.f7o.nginx.crafter.cert;

import de.f7o.nginx.crafter.Crafter;
import io.vertx.rxjava.core.buffer.Buffer;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.rx.java.ObservableFuture;
import io.vertx.rx.java.RxHelper;
import io.vertx.rxjava.core.Future;
import io.vertx.rxjava.core.Vertx;
import io.vertx.rxjava.core.file.FileSystem;
import javafx.beans.binding.ObjectExpression;
import org.shredzone.acme4j.*;
import org.shredzone.acme4j.challenge.Challenge;
import org.shredzone.acme4j.challenge.Dns01Challenge;
import org.shredzone.acme4j.challenge.Http01Challenge;
import org.shredzone.acme4j.exception.AcmeConflictException;
import org.shredzone.acme4j.exception.AcmeException;
import org.shredzone.acme4j.util.KeyPairUtils;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.util.Collection;

public class Manager {
    private Logger log = LoggerFactory.getLogger(Manager.class);


    private String certFolder;
    private FileSystem fs;
    private RegistrationBuilder builder;
    private Registration registration;
    private Session session;

    private int keyLength = 2048;

    private JsonObject conf;

    public Manager(Vertx vertx) {
        conf = vertx.getOrCreateContext().config();

        certFolder = conf.getJsonObject("nginx").getString("cert_dir");
        fs = vertx.fileSystem();
        if(conf.getJsonObject("acme").getBoolean("enabled", false)) {
            vertx.executeBlocking(this::startAcmeSession, res -> {
                log.info(res.result());

                vertx.executeBlocking(f -> {
                    this.acmeChallenge("test.f7o.de", null, f);
                }, res2 -> {
                    log.warn(res2.result());
                    log.warn(res2.cause());
                });
            });
        }

    }

    private void startAcmeSession(Future<Object> future) {
        KeyPair keyPair;
        try {
            keyPair = readKeyPair(certFolder + "/keypair.pem");
        } catch (IOException e) {
            future.fail(e.getMessage());
            return;
        }

        try {
            builder = new RegistrationBuilder();
            builder.addContact("mailto:" + conf.getJsonObject("acme").getString("email"));
            session = new Session("acme://letsencrypt.org/staging", keyPair);
            registration = builder.create(session);
            registration.modify().setAgreement(new URI(conf.getJsonObject("acme").getString("agreement_url"))).commit();
            URI accountLocationUri = registration.getLocation();

            future.complete(accountLocationUri);
        } catch (AcmeConflictException ex) {
            registration = Registration.bind(session, ex.getLocation());
            future.complete(registration.getLocation().toString());
        } catch (AcmeException e) {
            future.fail(e.getMessage());

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    public void createKeyPair(String domain, Future<Object> future) {
        try {

            String domainCertFolder = certFolder;

            if(!domain.equals("")) {
                domainCertFolder = certFolder + "/" + domain;
                if (!fs.existsBlocking(domainCertFolder)) {
                    fs.mkdirBlocking(domainCertFolder);
                }
            }

            if(!fs.existsBlocking(domainCertFolder + "/keypair.pem")) {
                KeyPair keypair = KeyPairUtils.createKeyPair(keyLength);
                writeKeyPair(keypair, domainCertFolder + "/keypair.pem");
                future.complete();

            } else {
                future.fail("key already exists");
            }

        } catch (IOException e) {
            future.fail(e.getMessage());
        }
    }

    public void acmeChallenge(String domain, KeyPair keyPair, Future<Object> future) {
        try {
            Authorization auth = registration.authorizeDomain(domain);

            Http01Challenge c = auth.findChallenge(Http01Challenge.TYPE);

            int count = 0;
                Buffer buf = Buffer.buffer();
                buf.appendString(c.getAuthorization());
                fs.writeFileBlocking(certFolder + "/" + domain + "/" + c.getToken(), buf);
            c.trigger();

            while (c.getStatus() != Status.VALID) {
                    Thread.sleep(5000L);
                    c.update();
                    count++;
                    if(count > 2) {
                        future.fail( c.getStatus().name());
                        break;
                    }

                }
                if(c.getStatus() == Status.VALID) {
                    future.complete("reg");
                }


        } catch (AcmeException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private KeyPair readKeyPair(String file) throws IOException {
        FileReader fr = new FileReader(file);
        return KeyPairUtils.readKeyPair(fr);
    }

    private void writeKeyPair(KeyPair keypair, String file) throws IOException {
        FileWriter fw = new FileWriter(file);
        KeyPairUtils.writeKeyPair(keypair, fw);
    }
}