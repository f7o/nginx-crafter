package de.f7o.nginx.crafter;

import io.vertx.core.Future;
import io.vertx.rxjava.core.http.HttpServer;
import io.vertx.rxjava.core.AbstractVerticle;
import io.vertx.rxjava.ext.web.Router;
import io.vertx.rxjava.ext.web.RoutingContext;

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
        return router;
    }

    private void healthMessage(RoutingContext ctx) {
        ctx.response().end("I'am crafting and u?");
    }
}
