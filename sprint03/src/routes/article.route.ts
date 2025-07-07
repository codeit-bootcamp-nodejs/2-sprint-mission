import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorizeArticle } from "../middlewares/authorize.article";

import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
  articleLike,
} from "../controllers/article.controller";

const router = Router();

// 게시글 목록, 등록
router.route("/").get(getArticles).post(authenticate, createArticle);

// 게시글 조회, 수정, 삭제
router
  .route("/:id")
  .get(authenticate, getArticleById)
  .patch(authenticate, authorizeArticle, updateArticle)
  .delete(authenticate, authorizeArticle, deleteArticle);

// 게시글 좋아요 추가, 삭제
router.route("/:id/like").post(authenticate, articleLike);

export default router;
