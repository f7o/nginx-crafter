package de.f7o.nginx.crafter;

import de.f7o.nginx.crafter.cert.Manager;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.rxjava.ext.web.handler.BodyHandler;
import io.vertx.rxjava.core.file.FileSystem;
import io.vertx.rxjava.core.http.HttpServer;
import io.vertx.rxjava.core.AbstractVerticle;
import io.vertx.rxjava.ext.web.Router;
import io.vertx.rxjava.ext.web.RoutingContext;
import io.vertx.rxjava.ext.web.handler.StaticHandler;
import rx.Observable;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class Crafter extends AbstractVerticle {

    private Logger log = LoggerFactory.getLogger(Crafter.class);

    private String config_dir = "";
    private String cert_dir = "";
    private FileSystem fs;

    Manager man;

    @Override
    public void start(Future startFuture) {
        HttpServer server = vertx.createHttpServer();
        server.requestHandler(createRouter()::accept).listen(8080, "localhost");
        config_dir = config().getJsonObject("nginx").getString("config_dir", "/etc/nginx/");
        cert_dir = config().getJsonObject("nginx").getString("cert_dir", "/etc/nginx/ssl/");
        if (config().getJsonObject("crafter_server").getBoolean("print_config", false)) {
            log.info(config().encodePrettily());
        }
        fs = vertx.fileSystem();



        startFuture.complete();
    }

    @Override
    public void stop(Future stopFuture) {
        stopFuture.complete();
    }

    private Router createRouter() {
        Router router = Router.router(vertx);
        String router_prefix = config().getJsonObject("crafter_server").getString("router_prefix", "/api");
        router.get(router_prefix + "/health").handler(this::healthMessage);
        router.get(router_prefix + "/nginx/config").handler(this::getNginxConfig);
        router.get(router_prefix + "/sites/list/").handler(this::getSiteFileList);
        router.get(router_prefix + "/sites/enabled/:site").handler(this::getSiteEnabled);
        router.get(router_prefix + "/sites/toggle/:site").handler(this::toggleSite);
        router.get(router_prefix + "/sites/template/:tpl").handler(this::getSiteTpl);

        router.route(router_prefix + "/sites/:site*").handler(BodyHandler.create());
        router.put(router_prefix + "/sites/:site*").handler(this::putSiteConfig);

        router.delete(router_prefix + "/sites/:site").handler(this::deleteSiteConfig);

        router.get(router_prefix + "/sites/:site").handler(this::getSiteConfig);

        router.get(router_prefix + "/locations/template/:tpl").handler(this::getLocationTpl);

        man = new Manager(vertx);
        router.mountSubRouter(router_prefix + "/cert", man.createRouter());

        createStaticRoutes(router);
        return router;
    }

    private void createStaticRoutes(Router router) {
        router.route("/index.html").handler(req -> req.response().sendFile("client/index.html"));
        router.route("/favicon.ico").handler(req -> req.response().sendFile("client/favicon.ico"));
        router.route("/robots.txt").handler(req -> req.response().sendFile("client/robots.txt"));

        router.routeWithRegex("/.*\\.js").handler(StaticHandler.create("client"));
        router.routeWithRegex("/.*\\.map").handler(StaticHandler.create("client"));
        router.routeWithRegex("/.*\\.css").handler(StaticHandler.create("client"));
        router.routeWithRegex("/.*\\.(png|ttf|woff|woff2)").handler(StaticHandler.create("client"));

        router.route("/assets").handler(StaticHandler.create("client/assets"));

        router.route("/index.html").handler(req -> req.response().sendFile("client/index.html"));
        router.route("/").handler(req -> req.response().sendFile("client/index.html"));
    }


    private void healthMessage(RoutingContext ctx) {
        ctx.response().end("I'am crafting and u?");
    }

    private void getSiteFileList(RoutingContext ctx) {
        configContext(ctx);
        fs.readDir(config_dir + "/" + FolderConstants.SITES_AVAILABLE, handler -> {
                    ctx.response().end(new JsonArray(
                            handler
                            .result()
                            .stream()
                            .map(f -> f.substring(f.lastIndexOf('/') + 1))
                            .collect(Collectors.toList()))
                            .toString()
                    );
                }
        );
    }

    private void getSiteConfig(RoutingContext ctx) {
        configContext(ctx);
        fs.readFile(getFilePath(ctx.request().getParam("site")), v ->
                ctx.response().end(v.result()));
    }

    private void putSiteConfig(RoutingContext ctx) {
        configContext(ctx);
        String site = ctx.request().getParam("site");
        log.info(ctx.getBodyAsString());
        JsonObject o = new JsonObject().put("site", site);
        fs.writeFile(getFilePath(site), ctx.getBody(), res ->
                ctx.response().end(o.put("files", "saved").encodePrettily())
        );
    }

    private void deleteSiteConfig(RoutingContext ctx) {
        configContext(ctx);
        String site = ctx.request().getParam("site");
        JsonObject o = new JsonObject().put("site", site);
        isSiteEnabled(site).subscribe(v ->
                        fs.unlink(getLinkPath(site), unlink -> {
                            fs.delete(getFilePath(site),
                                    res -> ctx.response().end(o.put("action", "delete_unlink").encodePrettily()));
                        }), err -> {
            fs.delete(getFilePath(site),
                    res -> ctx.response().end(o.put("action", "delete_pure").encodePrettily()));
        });
    }

    private void getNginxConfig(RoutingContext ctx) {
        configContext(ctx);
        String path = config_dir + "/nginx.conf";
        fs.readFile(path, v ->
                ctx.response().end(v.result()));
    }

    private void getSiteEnabled(RoutingContext ctx) {
        configContext(ctx);
        isSiteEnabled(ctx.request().getParam("site"))
                .subscribe(v -> {
                    ctx.response().end("true");
                }, err -> {
                    ctx.response().end("false");

                });
    }

    private void toggleSite(RoutingContext ctx) {
        configContext(ctx);
        String file = ctx.request().getParam("site");
        String path_link = getLinkPath(file);
        String path_exists = getFilePath(file);
        JsonObject o = new JsonObject().put("site", file);
        isSiteEnabled(file).subscribe(v ->
                        fs.unlink(path_link, res -> ctx.response().end(o.put("enabled", false).encodePrettily())),
                err ->
                        fs.symlink(path_link, path_exists, res -> ctx.response().end(o.put("enabled", true).encodePrettily()))

        );
        vertx.executeBlocking(this::reloadNginx, res -> {
            if (res.failed()) log.error(res.cause());
        });
    }

    private void getSiteTpl(RoutingContext ctx) {
        configContext(ctx);
        String tpl = ctx.request().getParam("tpl");
        String path = "/Users/flo/git/nginx-crafter/templates/sites/"+tpl+".crafter";
        fs.readFile(path, v ->
                ctx.response().end(v.result()));
    }

    private void getLocationTpl(RoutingContext ctx) {
        configContext(ctx);
        String tpl = ctx.request().getParam("tpl");
        String path = "/Users/flo/git/nginx-crafter/templates/locations/"+tpl+".crafter";
        fs.readFile(path, v ->
                ctx.response().end(v.result()));
    }

    private void configContext(RoutingContext ctx) {
        //ctx.response().setChunked(true);
        ctx.response().putHeader("Content-Type", "application/json");
    }

    private Observable<String> isSiteEnabled(String site) {
        return fs.readSymlinkObservable(getLinkPath(site));
    }

    private String getLinkPath(String site) {
        return config_dir + "/" + FolderConstants.SITES_ENABLED + "/" + site;
    }

    private String getFilePath(String site) {
        return config_dir + "/" + FolderConstants.SITES_AVAILABLE + "/" + site;
    }

    private void reloadNginx(io.vertx.rxjava.core.Future<Object> future) {
        try {
            Process p = Runtime
                    .getRuntime()
                    .exec("service nginx reload");
            p.waitFor();
            future.complete();
        } catch (IOException | InterruptedException e) {
            log.error(e.getMessage());
            future.failed();
        }
    }
}
