import { Router } from "express";
import commentController from "../controllers/comment.controller";
import { verifyAccessToken } from "../middlewares/verifyAccesstoken";
import { validateBody } from "../middlewares/validation.middleware";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../types/zodSchema/comment.schema"

const router = Router();

// 상품 댓글 조회
router.get(
  "/products/:productId/comments",
  commentController.getAllProductComments
);

// 상품 댓글 생성
router.post(
  "/products/:productId/comments",
  verifyAccessToken,
  validateBody(createCommentSchema),
  commentController.createProductComment
);

// 상품 댓글 수정
router.put(
  "/products/:productId/comments/:commentId",
  verifyAccessToken,
  validateBody(updateCommentSchema),
  commentController.updateProductComment
);

// 상품 댓글 삭제
router.delete(
  "/products/:productId/comments/:commentId",
  verifyAccessToken,
  commentController.deleteProductComment
);

// 게시글 댓글 조회
router.get(
  "/articles/:articleId/comments",
  commentController.getAllArticleComments
);

// 게시글 댓글 생성
router.post(
  "/articles/:articleId/comments",
  verifyAccessToken,
  validateBody(createCommentSchema),
  commentController.createArticleCommnet
);

// 게시글 댓글 수정
router.put(
  "/articles/:articleId/comments/:commentId",
  verifyAccessToken,
  validateBody(updateCommentSchema),
  commentController.updateArticleCommnent
);

// 게시글 댓글 삭제
router.delete(
  "/articles/:articleId/comments/:commentId",
  verifyAccessToken,
  commentController.deleteArticleComment
);

export default router;
