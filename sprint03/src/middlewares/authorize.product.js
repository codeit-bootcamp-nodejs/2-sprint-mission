import { db } from "../lib/db.js";

export async function authorizeProduct(req, res, next) {
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error();
    error.status = 400;
    return next(error);
  }

  try {
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const error = new Error();
      error.status = 404;
      return next(error);
    }

    if (product.userId !== req.user.id) {
      const error = new Error();
      error.status = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}
