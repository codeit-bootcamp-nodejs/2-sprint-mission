import { Response } from "express";

const ACCESS_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || "accessToken";
const REFRESH_COOKIE = process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";

export const setTokensAsCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokens = (res: Response) => {
  res.clearCookie(ACCESS_COOKIE);
  res.clearCookie(REFRESH_COOKIE);
};
