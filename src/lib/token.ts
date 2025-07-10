import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ sub: userId }, ACCESS_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ sub: userId }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET);
