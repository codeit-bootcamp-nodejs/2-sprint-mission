import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { handleError } from './error';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './const';
import { OptionsType, TokenResultType, UserPayload } from '../types/token.types';

/**
 * @description JWT 토큰 생성 함수
 * @param {object} user 
 */
export const createToken = (user: UserPayload): TokenResultType => {
  const payload = { userId: user.id };

  const accessToken: string = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
  const refreshToken: string = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

/**
 * @description JWT 토큰 갱신 함수
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 */
export const refreshToken = async (req: Request, res: Response) => {
  // 리프레시 토큰 조회
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) return handleError(res, null, "인증 정보가 없습니다.", 401);

  const { userId } = verifyRefreshToken(refreshToken);
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return handleError(res, null, "해당 사용자가 존재하지 않습니다.", 400);

  const { accessToken, refreshToken: newRefreshToken } = createToken(user);
  setCookie(res, accessToken, newRefreshToken);

  res.status(200).json({ message: "토큰이 갱신되었습니다." });
}

/**
 * @description JWT 액세스 토큰 검증 함수
 * @param {string} token 
 */
export const verifyAccessToken = (token: string) => {
  const decoded: string | jwt.JwtPayload = jwt.verify(token, JWT_ACCESS_SECRET);
  if (typeof decoded === 'string' || !decoded) {
    throw new Error('Invalid refresh token');
  }

  return { userId: decoded.userId as number };
}

/**
 * @description JWT 리프레시 토큰 검증 함수
 * @param {string} token 
 */
export const verifyRefreshToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  if (typeof decoded === 'string' || !decoded) {
    throw new Error('Invalid refresh token');
  }

  return { userId: decoded.userId };
}

/**
 * @description 쿠키에 토큰을 설정하는 함수
 * @param {object} res - Express 응답 객체
 * @param {string} accessToken - 액세스 토큰
 * @param {string} refeshToken - 리프레시 토큰
 */
export const setCookie = (res: Response, accessToken: string, refeshToken: string) => {
  // token option 
  const options: OptionsType = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'test' ? 'lax' : 'strict', // 테스트 환경에서는 'lax' 사용
  };
  // cookie에 AccessToken 저장
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { ...options, maxAge: 1 * 60 * 60 * 1000 });
  // cookie에 RefreshFToken 저장
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refeshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 });
}
