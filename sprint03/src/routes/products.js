import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeProduct } from "../middlewares/authorize.product.js";

import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/product.controller.js";

const router = Router();

// 상품 목록, 등록
router.route("/").get(getProducts).post(authenticate, createProduct);

// 상품 조회, 수정, 삭제
router
  .route("/:id")
  .get(getProductById)
  .patch(authenticate, authorizeProduct, updateProduct)
  .delete(authenticate, authorizeProduct, deleteProduct);

export default router;
