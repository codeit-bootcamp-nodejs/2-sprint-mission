import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../lib/constants";

// 토큰 생성 
function createToken(userId: number) {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '10h',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
}

// 토큰 검증
function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  if (typeof decoded === "string" || decoded === null || !("id" in decoded)) {
    throw new Error("Invalid token payload");
  }
  return { userId: (decoded as JwtPayload & { id: number }).id };
}

function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  if (typeof decoded === "string" || decoded === null || !("id" in decoded)) {
    throw new Error("Invalid token payload");
  }
  return { userId: (decoded as JwtPayload & { id: number }).id };
}

export { createToken, verifyAccessToken, verifyRefreshToken };
