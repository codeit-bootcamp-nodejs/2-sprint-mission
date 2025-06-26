import createError from "http-errors";
import express from "express";
import logger from "morgan";
import cors from "cors";

import errorHandler from "./lib/errorHandler.js";

import indexRouter from "./routes/index.js";
import productsRouter from "./routes/products.js";
import articlesRouter from "./routes/articles.js";
import productcommentsRouter from "./routes/productcomments.js";
import articlecommentsRouter from "./routes/articlecomments.js";
import documentsRouter from "./routes/documents.js";

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(logger("dev"));
app.use(express.json());

// 라우팅 설정
app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/articlecomments", articlecommentsRouter);
app.use("/productcomments", productcommentsRouter);
app.use("/documents", documentsRouter);

// 에러 핸들링
app.use(errorHandler);

export default app;
