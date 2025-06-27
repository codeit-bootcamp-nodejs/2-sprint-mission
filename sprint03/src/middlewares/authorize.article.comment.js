import { db } from "../lib/db.js";

export async function authorizeArticleComment(req, res, next) {
  const articleId = Number(req.params.articleId);
  const commentId = Number(req.params.commentId);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    const error = new Error("잘못된 게시글 ID 입니다.");
    error.status = 400;
    return next(error);
  }

  if (!Number.isInteger(commentId) || commentId <= 0) {
    const error = new Error("잘못된 댓글 ID 입니다.");
    error.status = 400;
    return next(error);
  }

  try {
    const comment = await db.articleComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      const error = new Error("댓글을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    if (comment.userId !== req.user.id) {
      const error = new Error("수정/삭제 권한이 없습니다.");
      error.status = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}
