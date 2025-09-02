import { Request, Response } from "express";

function isHttps(req: Request) {
  // nginx가 X-Forwarded-Proto를 넘겨주므로 이 값으로 판별
  return req.secure || req.headers["x-forwarded-proto"] === "https";
}

export const setTokensAsCookies = (
  req: Request,
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const secureFlag = isHttps(req);
  const sameSite = secureFlag ? "none" : "lax";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: secureFlag,
    sameSite,
    path: "/",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: secureFlag,
    sameSite,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokens = (res: Response) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
};
