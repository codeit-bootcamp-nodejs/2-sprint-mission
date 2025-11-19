import express from "express";
import dotenv from "dotenv";
import api from "./api/api.router.js";
import { notFoundHandler } from "./handlers/not-found.handler.js";
import { globalErrorHandler } from "./handlers/global-error.handler.js";
import { faviconHandler } from "./handlers/favicon.handler.js";

dotenv.config();

export class Server {
    constructor() {
        this.server = express();
        this.port = process.env.PORT || 4000;
        this.host = process.env.HOST || "localhost";
        this.publicDir = process.env.PUBLIC_DIR || "public";

        this.#setMiddlewares();
        this.#setRoutes();
    }

    #setMiddlewares() {
        // PRE_MIDDLEWARES
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use(express.static(this.publicDir));
        this.server.use(faviconHandler);

        // ROUTERS
        this.#setRoutes();

        // POST_MIDDLEWARES
        this.server.use(notFoundHandler);
        this.server.use(globalErrorHandler);

    }

    #setRoutes() {
        this.server.use("/api", api);
    }

    start() {
        this.server.listen(this.port, this.host, () => {
            console.log(`Server running at http://${this.host}:${this.port}`);
        });
    }
}
