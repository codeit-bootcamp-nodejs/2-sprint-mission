import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorizeProduct } from "../middlewares/authorize.product";

import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
  productLike,
} from "../controllers/product.controller";

const router = Router();

// 상품 목록, 등록
router.route("/").get(getProducts).post(authenticate, createProduct);

// 상품 조회, 수정, 삭제
router
  .route("/:id")
  .get(authenticate, getProductById)
  .patch(authenticate, authorizeProduct, updateProduct)
  .delete(authenticate, authorizeProduct, deleteProduct);

// 상품 좋아요 추가, 삭제
router.route("/:id/like").post(authenticate, productLike);

export default router;
