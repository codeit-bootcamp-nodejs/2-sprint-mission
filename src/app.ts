import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./lib/passport";
import errorMiddleware from "./middlewares/error.middleware";

import routes from "./routes/index.route";

const app = express();

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
app.get("/", (req, res) => {
  res.send("Hello from EC2 + pm2 🚀");
});
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));

// 에러 미들웨어
app.use(errorMiddleware);

export default app;
