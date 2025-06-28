import { db } from "../lib/db.js";

export async function authorizeProductComment(req, res, next) {
  const productId = Number(req.params.productId);
  const commentId = Number(req.params.commentId);

  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error();
    error.status = 400;
    return next(error);
  }

  if (!Number.isInteger(commentId) || commentId <= 0) {
    const error = new Error();
    error.status = 400;
    return next(error);
  }

  try {
    const comment = await db.productComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      const error = new Error();
      error.status = 404;
      return next(error);
    }

    if (comment.userId !== req.user.id) {
      const error = new Error();
      error.status = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}
