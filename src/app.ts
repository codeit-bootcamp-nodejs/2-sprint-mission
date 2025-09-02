import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./lib/passport";
import errorMiddleware from "./middlewares/error.middleware";

import routes from "./routes/index.route";

const app = express();

app.set("trust proxy", 1);

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport 초기화
app.use(passport.initialize());

// 라우터 등록
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy 🚀" });
});
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));

// 에러 미들웨어
app.use(errorMiddleware);

export default app;
