import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import e, { NextFunction, Request, Response } from "express";
import passport from "./lib/passport/index";
import { HttpError } from "http-errors";
import { createSocket } from "./lib/socket";
import createRouter from "./routes/index";
import path from "path";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/files", express.static("uploads"));
app.use(express.static('public'));

const server = createSocket(app);
const io = server.io;

app.use("/", createRouter(io));

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404, "Not Found"));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDevelopment = req.app.get("env") === "development";
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";

if (message === "Unauthorized") {
  statusCode = 401;
 } else if (message.includes("not found")) {
  statusCode = 404;
 } else if (message.includes("Unauthorized to update") || message.includes("Unauthorized to delete")) {
  statusCode = 403;
} else if (message.includes("already exist!")) {
  statusCode = 409;
 }
  
  console.error(err);

  const errorResponse: { message: string; stack?: string } = {
    message: message,
  };

  if (isDevelopment && err.stack) {
    errorResponse.stack = err.stack;
  }
  res.status(statusCode).json(errorResponse);
});

export { app, server };