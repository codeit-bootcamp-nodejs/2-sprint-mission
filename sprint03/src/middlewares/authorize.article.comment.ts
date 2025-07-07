import { db } from "../lib/db";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";



export const authorizeArticleComment: RequestHandler = async (req, res, next) => {
  const articleId = Number(req.params.articleId);
  const commentId = Number(req.params.commentId);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    throw new HttpError(400);
  }

  if (!Number.isInteger(commentId) || commentId <= 0) {
    throw new HttpError(400);
  }

  try {
    const comment = await db.articleComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new HttpError(400);

    // 권한 검사
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    if (comment.userId !== req.user.id) throw new HttpError(403);

    next();
  } catch (error) {
    next(error);
  }
}
