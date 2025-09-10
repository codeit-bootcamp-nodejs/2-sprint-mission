import express from "express";
import logger from "morgan";
import cors from "cors";

const app = express();

import errorHandler from "./lib/error.handler";

import productsRouter from "./routes/product.route";
import articlesRouter from "./routes/article.route";
import productcommentsRouter from "./routes/product.comment.route";
import articlecommentsRouter from "./routes/article.comment.route";
// import documentsRouter from "./routes/document.route";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import notificationRouter from "./routes/notification.route";
import imagesRouter from "./routes/image.route";


// 미들웨어 설정
app.use(cors());
app.use(logger("dev"));
app.use(express.json());

// 라우팅 설정
app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/articlecomments", articlecommentsRouter);
app.use("/productcomments", productcommentsRouter);
// app.use("/documents", documentsRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/notification", notificationRouter);
app.use("/images", imagesRouter);

// 헬스체크 라우트
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 에러 핸들링
app.use(errorHandler);



export default app;
