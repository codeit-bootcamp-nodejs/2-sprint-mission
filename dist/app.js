"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./lib/passport/index"));
const socket_1 = require("./lib/socket");
const index_2 = __importDefault(require("./routes/index"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(index_1.default.initialize());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.use("/files", express_1.default.static("uploads"));
app.use(express_1.default.static('public'));
const server = (0, socket_1.createSocket)(app);
exports.server = server;
const io = server.io;
app.use("/", (0, index_2.default)(io));
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404, "Not Found"));
});
app.use(function (err, req, res, next) {
    const isDevelopment = req.app.get("env") === "development";
    let statusCode = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    if (message === "Unauthorized") {
        statusCode = 401;
    }
    else if (message.includes("not found")) {
        statusCode = 404;
    }
    else if (message.includes("Unauthorized to update") || message.includes("Unauthorized to delete")) {
        statusCode = 403;
    }
    else if (message.includes("already exist!")) {
        statusCode = 409;
    }
    console.error(err);
    const errorResponse = {
        message: message,
    };
    if (isDevelopment && err.stack) {
        errorResponse.stack = err.stack;
    }
    res.status(statusCode).json(errorResponse);
});
