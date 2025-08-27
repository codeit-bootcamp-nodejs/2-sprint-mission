import express from "express";
import logger from "morgan";
import cors from "cors";

import errorHandler from "./lib/error.handler";

import productsRouter from "./routes/product.route";
import articlesRouter from "./routes/article.route";
import productcommentsRouter from "./routes/product.comment.route";
import articlecommentsRouter from "./routes/article.comment.route";
import documentsRouter from "./routes/document.route";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(logger("dev"));
app.use(express.json());

// 라우팅 설정
app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/articlecomments", articlecommentsRouter);
app.use("/productcomments", productcommentsRouter);
app.use("/documents", documentsRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);

// 에러 핸들링
app.use(errorHandler);



export default app;
