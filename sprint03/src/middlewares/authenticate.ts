import { db } from "../lib/db";
import { verifyAccessToken } from "../lib/token";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";



export const authenticate: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 로그인 여부(토큰) 검사
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "인증이 필요합니다."));
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(accessToken);
    const user = await db.user.findUnique({ where: { id: payload.userId } });

    if (!user) return next(new HttpError(401, "인증이 필요합니다."));


    req.user = user;

    next();
  } catch (err) {
    next(new HttpError(401, "인증에 실패했습니다."));
  }
}
