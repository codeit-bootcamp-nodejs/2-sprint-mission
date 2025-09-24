"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const products_1 = __importDefault(require("./products"));
const articles_1 = __importDefault(require("./articles"));
const articleComments_1 = __importDefault(require("./articleComments"));
const productComments_1 = __importDefault(require("./productComments"));
const documents_1 = __importDefault(require("./documents"));
const like_1 = __importDefault(require("./like"));
const notifications_1 = __importDefault(require("./notifications"));
const createRouter = (io) => {
    const router = express_1.default.Router();
    router.use("/users", (0, users_1.default)());
    router.use("/products", (0, products_1.default)(io));
    router.use("/articles", (0, articles_1.default)());
    router.use("/articles/comments", (0, articleComments_1.default)(io));
    router.use("/products/comments", (0, productComments_1.default)(io));
    router.use("/documents", (0, documents_1.default)());
    router.use("/likes", (0, like_1.default)(io));
    router.use("/files", express_1.default.static("uploads"));
    router.use("/notifications", (0, notifications_1.default)(io));
    router.get("/", (req, res) => {
        res.status(200).json({ message: "welcome!" });
    });
    return router;
};
exports.default = createRouter;
