import { NextFunction, Request, Response } from "express";

// 커스텀 에러 클래스들
export class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = "로그인이 필요합니다.") {
    super(message, 401);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = "권한이 없습니다.") {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "존재하지 않습니다.") {
    super(message, 404);
  }
}

// 공통 에러 응답 함수
export const handleError = (res: Response, error: unknown, message = '작업 중 오류가 발생하였습니다', status = 500) => {
  console.error(message, error);
  res.status(status).json({ error: message });
}

// 비동기 핸들러 wrapper 함수
export const withAsync = (handler : Function) => {
  return async (req:Request, res: Response, next:NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      // CustomError인 경우 statusCode와 message 사용
      if (error instanceof CustomError) {
        handleError(res, error, error.message, error.statusCode);
      } else {
        // 일반 에러인 경우 기본 처리
        handleError(res, error);
      }
    }
  };
}
