import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'dev-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret';
const ACCESS_TOKEN_EXPIRES = '1h';
const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 7; // 7일(초)

// AccessToken 발급
export function signAccessToken(payload: object): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

// RefreshToken 발급
export function signRefreshToken(payload: object): string {
  const raw = crypto.randomBytes(64).toString('hex');
  return jwt.sign({ ...payload, jti: raw }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
}

// AccessToken 검증
export function verifyAccess(token: string): string | JwtPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

// RefreshToken 검증
export function verifyRefresh(token: string): string | JwtPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

// RefreshToken DB 저장
export async function persistRefreshToken(userId: number, refreshToken: string): Promise<void> {
  const tokenHash = await bcrypt.hash(refreshToken, 12);

  const decoded = jwt.decode(refreshToken) as JwtPayload | null;
  if (!decoded || typeof decoded.exp !== 'number') {
    throw new Error('Invalid refresh token');
  }

  const expiresAt = new Date(decoded.exp * 1000);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
}

// RefreshToken 폐기
export async function revokeRefreshToken(refreshToken: string): Promise<boolean> {
  const tokens = await prisma.refreshToken.findMany();

  for (const t of tokens) {
    const match = await bcrypt.compare(refreshToken, t.tokenHash);
    if (match) {
      await prisma.refreshToken.delete({ where: { id: t.id } });
      return true;
    }
  }

  return false;
}
