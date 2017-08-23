package de.f7o.nginx.crafter.cert;

import io.vertx.rxjava.core.Future;
import io.vertx.rxjava.core.Vertx;
import io.vertx.rxjava.core.file.FileSystem;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemWriter;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;

public class Manager {
    private String certFolder;
    private FileSystem fs;

    private int keyLength = 2048;

    public Manager(Vertx vertx) {
        certFolder = vertx.getOrCreateContext().config().getJsonObject("nginx").getString("cert_dir");
        fs = vertx.fileSystem();
    }

    public void createKeyPair(String domain, Future<Object> future) {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");

            keyGen.initialize(keyLength);
            KeyPair keypair = keyGen.genKeyPair();

            String domainCertFolder = certFolder + "/" + domain;
            if (!fs.existsBlocking(domainCertFolder)) {
                fs.mkdirBlocking(certFolder + "/" + domain);
            }
            PemObject pemObjectPriv = new PemObject("PRIVATE KEY", keypair.getPrivate().getEncoded());
            PemObject pemObjectPub = new PemObject("PUBLIC KEY", keypair.getPublic().getEncoded());
            PemWriter pemWriterPriv = new PemWriter(new OutputStreamWriter((new FileOutputStream(
                    certFolder + "/" + domain + "/private.pem"
            ))));
            PemWriter pemWriterPub = new PemWriter(new OutputStreamWriter((new FileOutputStream(
                    certFolder + "/" + domain + "/public.pem"
            ))));
            pemWriterPub.writeObject(pemObjectPub);
            pemWriterPriv.writeObject(pemObjectPriv);
            pemWriterPub.close();
            pemWriterPriv.close();

            future.complete();
        } catch (NoSuchAlgorithmException | IOException e) {
            future.fail(e.getMessage());
        }
    }

    public void acmeChallenge(String domain, Future<Object> future) {

    }
}
