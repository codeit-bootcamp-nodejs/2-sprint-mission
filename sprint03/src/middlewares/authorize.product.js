import { db } from "../lib/db.js";

export async function authorizeProduct(req, res, next) {
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error("잘못된 상품 ID 입니다.");
    error.status = 400;
    return next(error);
  }

  try {
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const error = new Error("상품을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    if (product.userId !== req.user.id) {
      const error = new Error("수정/삭제 권한이 없습니다.");
      error.status = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}
