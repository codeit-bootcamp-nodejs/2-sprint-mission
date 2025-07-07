import { db } from "../lib/db";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";



export const authorizeArticle: RequestHandler = async (req, res, next) => {
  const articleId = Number(req.params.id);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    throw new HttpError(400);
  }

  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!article) throw new HttpError(404);

    // 권한 검사
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    if (article.userId !== req.user.id) throw new HttpError(403);

    next();
  } catch (error) {
    next(error);
  }
}
