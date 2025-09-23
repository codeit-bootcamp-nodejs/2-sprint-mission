import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';
import { Payload } from '../types/auth.type';

// 액세스 토큰 생성
export function generateAccessToken(payload: Payload): string {
  const options: SignOptions = {
    expiresIn: config.jwt.accessExpiration,
  };
  return jwt.sign(payload, config.jwt.accessSecret, options);
}

// 리프레시 토큰 생성
export function generateRefreshToken(payload: Payload): string {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiration,
  };
  return jwt.sign(payload, config.jwt.refreshSecret, options);
}

// 액세스 토큰 검증
export function verifyAccessToken(token: string): Payload {
  return jwt.verify(token, config.jwt.accessSecret) as Payload;
}

// 리프레시 토큰 검증
export function verifyRefreshToken(token: string): Payload {
  return jwt.verify(token, config.jwt.refreshSecret) as Payload;
}

// 남은 만료시간 확인
export function getTokenRemainSeconds(token: string): number {
  const decoded = jwt.decode(token) as JwtPayload | null;
  if (!decoded || typeof decoded.exp !== 'number') {
    throw new Error('Invalid token: missing exp');
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp - nowInSeconds;
}
