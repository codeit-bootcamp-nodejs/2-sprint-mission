import { NextFunction, Request, Response } from "express";
import { db } from "../utils/db";
import { verifyAccessToken } from "../utils/token";
import { handleError } from "../utils/error";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "../utils/const";

const authenticate = async (req:Request, res:Response, next:NextFunction) => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!accessToken) return handleError(res, null, "액세스 토큰이 없습니다.", 401);
  if (!refreshToken) return handleError(res, null, "리프레시 토큰이 없습니다.", 401);

  try {
    // Token 정보에서 userId 추출
    const { userId } = verifyAccessToken(accessToken);

    // 데이터베이스에서 사용자 정보 조회
    const user = await db.user.findUnique({ where: { id: userId } });
    if(!user) return handleError(res, null, "해당 사용자가 존재하지 않습니다.", 404);
    
    // 요청 객체에 사용자 정보 추가
    req.user = user;
    next();
  } catch (error) {
    return handleError(res, null, "유효하지 않은 토큰입니다.", 403);
  }
}

export default authenticate;