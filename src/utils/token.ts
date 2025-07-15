// src/utils/token.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '../lib/constants';

export const generateTokens = (userId: number): {
  accessToken: string;
  refreshToken: string;
} => {
  const accessToken = jwt.sign({ sub: userId }, JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_TOKEN_SECRET!, {
    expiresIn: '1d',
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): { userId: number } => {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET!) as JwtPayload;
  return { userId:  Number(decoded.sub) };
};

export const verifyRefreshToken = (token: string): { userId: number } => {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET!) as JwtPayload;
  return { userId:  Number(decoded.sub) };
};
