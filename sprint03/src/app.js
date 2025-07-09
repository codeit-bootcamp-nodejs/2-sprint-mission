import { PORT } from "./lib/constants.js";
import express from "express";
import logger from "morgan";
import cors from "cors";

import errorHandler from "./lib/error.handler.js";

import productsRouter from "./routes/product.route.js";
import articlesRouter from "./routes/article.route.js";
import productcommentsRouter from "./routes/product.comment.route.js";
import articlecommentsRouter from "./routes/article.comment.route.js";
import documentsRouter from "./routes/document.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
