import { db } from "../lib/db.js";

export async function authorizeArticle(req, res, next) {
  const articleId = Number(req.params.id);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    const error = new Error();
    error.status = 400;
    return next(error);
  }

  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      const error = new Error();
      error.status = 404;
      return next(error);
    }

    if (article.userId !== req.user.id) {
      const error = new Error();
      error.status = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}
