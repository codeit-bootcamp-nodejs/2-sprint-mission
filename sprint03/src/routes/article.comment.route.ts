import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorizeArticleComment } from "../middlewares/authorize.article.comment";

import {
  createArticleComment,
  getArticleComments,
  updateArticleComment,
  deleteArticleComment,
} from "../controllers/article.comment.controller";

const router = Router();

// 게시글 댓글 목록, 등록
router
  .route("/:articleId")
  .get(getArticleComments)
  .post(authenticate, createArticleComment);

// 게시글 댓글 수정, 삭제
router
  .route("/:articleId/:commentId")
  .patch(authenticate, authorizeArticleComment, updateArticleComment)
  .delete(authenticate, authorizeArticleComment, deleteArticleComment);

export default router;
