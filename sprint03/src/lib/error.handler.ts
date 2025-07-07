import { ErrorRequestHandler } from "express";
import HttpError from "../types/httpError"


const errorMessages: Record<number, string> = {
  400: "잘못된 요청입니다.",
  401: "비밀번호가 틀렸습니다.",
  403: "권한이 없습니다.",
  404: "찾을 수 없습니다.",
  500: "서버 내부 오류가 발생했습니다.",
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

let statusCode = 500;
let message = "";

if (err instanceof HttpError) {
  statusCode = err.statusCode;
  message = err.message;
} else if (err.name === "StructError") {
  statusCode = 400;
  message = "타입이 올바르지 않습니다.";
}

if (!message || message.trim() === "") {
  message = errorMessages[statusCode] || "알 수 없는 오류가 발생했습니다.";
}
  
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};

export default errorHandler;
