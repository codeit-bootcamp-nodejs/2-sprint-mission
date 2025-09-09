import { RequestHandler } from 'express';
import { verifyAccess } from '../utils/token';

interface TokenPayload {
  id: number;
  email?: string;
  nickname?: string;
  iat: number;
  exp: number;
}

export const authenticate: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res
      .status(401)
      .json({ message: 'Malformed authorization header (expected: Bearer <token>)' });
  }

  try {
    const payload = verifyAccess(token) as Partial<TokenPayload>;
    if (!payload || typeof payload.id !== 'number') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    // req.user 타입(선언 파일)과 정확히 맞춰서 넣기
    req.user = { id: payload.id, email: payload.email, nickname: payload.nickname };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const optionalAuthenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header) return next();

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next();

  try {
    const payload = verifyAccess(token) as Partial<TokenPayload>;
    if (payload && typeof payload.id === 'number') {
      req.user = { id: payload.id, email: payload.email, nickname: payload.nickname };
    }
  } catch {
    // 토큰이 잘못됐어도 공개 조회는 막지 않음
  }
  next();
};