import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateTokens(userId) {
  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.sub };
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.sub };
  } catch (error) {
    return null;
  }
}