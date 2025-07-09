import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "./constants.js";
import jwt from "jsonwebtoken";


// 토큰 생성
function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
}

// 토큰 디코딩
function verifyAccessToken(token) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { userId: decoded.id };
}

function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  return { userId: decoded.id };
}

export { generateTokens, verifyAccessToken, verifyRefreshToken };
