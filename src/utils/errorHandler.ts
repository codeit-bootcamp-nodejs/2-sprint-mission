import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error]', err);

  // Prisma 에러 메시지 대응
  if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
    return res.status(404).json({ error: '리소스를 찾을 수 없습니다.' });
  }

  // 클라이언트 입력 오류 처리 (유효성 검사 등)
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  // 기타 예상치 못한 서버 에러
  return res.status(500).json({
    error: '서버 내부 오류가 발생했습니다.',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
