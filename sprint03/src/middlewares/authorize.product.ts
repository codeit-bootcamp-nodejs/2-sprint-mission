import { db } from "../lib/db";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";


export const authorizeProduct: RequestHandler = async (req, res, next) => {
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new HttpError(400);
  }

  try {
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new HttpError(404);

    // 권한 검사
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");
    
    if (product.userId !== req.user.id) throw new HttpError(403);

    next();
  } catch (error) {
    next(error);
  }
}
