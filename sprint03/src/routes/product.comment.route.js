import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeProductComment } from "../middlewares/authorize.product.comment.js";

import {
  createProductComment,
  getProductComments,
  updateProductComment,
  deleteProductComment,
} from "../controllers/product.comment.controller.js";

const router = Router();

// 상품 댓글 목록, 등록
router
  .route("/:productId")
  .get(getProductComments)
  .post(authenticate, createProductComment);

// 상품 댓글 수정, 삭제
router
  .route("/:productId/:commentId")
  .patch(authenticate, authorizeProductComment, updateProductComment)
  .delete(authenticate, authorizeProductComment, deleteProductComment);

export default router;
