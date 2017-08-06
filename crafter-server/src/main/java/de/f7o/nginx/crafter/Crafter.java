package de.f7o.nginx.crafter;

import io.vertx.core.Future;
import io.vertx.rxjava.core.http.HttpServer;
import io.vertx.rxjava.core.AbstractVerticle;
import io.vertx.rxjava.ext.web.Router;
import io.vertx.rxjava.ext.web.RoutingContext;
import io.vertx.rxjava.ext.web.handler.StaticHandler;

public class Crafter extends AbstractVerticle {


    @Override
    public void start(Future startFuture) {
        HttpServer server = vertx.createHttpServer();
        server.requestHandler(createRouter()::accept).listen(8080, "localhost");
        startFuture.complete();
    }

    @Override
    public void stop(Future stopFuture) {
        stopFuture.complete();
    }

    private Router createRouter() {
        Router router = Router.router(vertx);
        router.get("/api/health").handler(this::healthMessage);
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
}
