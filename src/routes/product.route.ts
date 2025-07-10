import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccesstoken";
import { validateBody } from "../middlewares/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../types/zodSchema/product.schema"
import upload from "../middlewares/upload.middleware";
import productController from "../controllers/product.controller";

const router = Router();

// 상품 목록 조회
router.get("/", productController.getAllProducts);

// 상품 상세 조회
router.get("/:productId", productController.getProductById);

// 상품 생성 
router.post(
  "/",
  verifyAccessToken,
  validateBody(createProductSchema),
  productController.createProduct
);

// 상품 수정
router.put(
  "/:productId",
  verifyAccessToken,
  upload.single("image"),
  validateBody(updateProductSchema),
  productController.updateProduct
);

// 상품 삭제
router.delete(
  "/:productId",
  verifyAccessToken,
  productController.deleteProduct
);

// 좋아요
router.post(
  "/:productId/like",
  verifyAccessToken,
  productController.likeProduct
);

// 좋아요 취소
router.delete(
  "/:productId/like",
  verifyAccessToken,
  productController.unlikeProduct
);

export default router;
