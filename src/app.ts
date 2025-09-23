import e, { NextFunction, Request, Response } from "express";

import express from "express";
import logger from "morgan";
import cors from "cors";
import createError from "http-errors";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/index";

// Express 앱 생성
const app = express();

// CORS 설정
app.use(cors({
  origin: "*", // 모든 도메인 허용
  methods: ["GET", "POST", "PATCH", "DELETE"], // 허용할 HTTP 메소드
  allowedHeaders: ["Content-Type", "Authorization"] // 허용할 헤더
}));

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser()); // 쿠키 파서 미들웨어 추가

app.use("/", indexRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.send("실행 완료");
});

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: { message: any; status: any; }, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({ error: err.message });
});

export default app;