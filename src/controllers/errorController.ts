// src/controllers/errorController.ts
import { Request, Response, NextFunction } from 'express';
import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';

export function defaultNotFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // superstruct 또는 커스텀 에러
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  // JSON 파싱 에러
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }

  // Prisma 관련 에러
  if (err.code) {
    console.error(err);
    return res.status(500).send({ message: 'Failed to process data' });
  }

  // NotFoundError 처리
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  // 기타 에러
  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}

export default globalErrorHandler;
