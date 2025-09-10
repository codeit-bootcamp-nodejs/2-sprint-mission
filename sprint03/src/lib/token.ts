import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "./constants";
import jwt from "jsonwebtoken";
import HttpError from "../types/httpError";



// 토큰 생성
function generateTokens(userId: number) {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
}

// 토큰 디코딩
function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);

  if (typeof decoded === "string") {
    throw new HttpError(401, "토큰이 유효하지 않습니다.");
  }

  return { userId: decoded.id };
}

function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);

  if (typeof decoded === "string") {
    throw new HttpError(401, "토큰이 유효하지 않습니다.");
  }

  return { userId: decoded.id };
}

export { generateTokens, verifyAccessToken, verifyRefreshToken };
