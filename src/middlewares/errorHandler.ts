import { Request, Response, NextFunction } from 'express';
import NotFoundError from './errors/NotFoundError';
import BadRequestError from './errors/BadRequestError';
import UnauthorizedError from './errors/UnauthorizedError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // 기본값
  let status = 500;
  let message = 'Internal Server Error';

  // 커스텀 에러 처리
  if (err instanceof BadRequestError) {
    status = 400;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    status = 404;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    status = 401;
    message = err.message;
  }

  // 로그로 에러 찍어두기 (선택)
  console.error(`[${status}] ${err.name}: ${err.message}`);

  res.status(status).json({ error: message });
}
