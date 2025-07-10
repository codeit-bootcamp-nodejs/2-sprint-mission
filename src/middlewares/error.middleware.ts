import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔴 Error:", err.message);

  const status = err.status || 500;
  const message = err.message || "서버 내부 오류가 발생했습니다.";

  res.status(status).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
