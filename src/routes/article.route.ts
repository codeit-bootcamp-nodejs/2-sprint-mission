import { Router } from "express";
import articleController from "../controllers/article.controller";
import { verifyAccessToken } from "../middlewares/verifyAccesstoken";
import { validateBody } from "../middlewares/validation.middleware";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../types/zodSchema/article.schema"

const router = Router();

// 게시글 목록 조회
router.get("/", articleController.getAllArticles);

// 게시글 상세 조회
router.get("/:articleId", articleController.getArticleById);

// 게시글 생성
router.post(
  "/",
  verifyAccessToken,
  validateBody(createArticleSchema),
  articleController.createArticle
);

// 게시글 수정
router.put(
  "/:articleId",
  verifyAccessToken,
  validateBody(updateArticleSchema),
  articleController.updateArticle
);

// 게시글 삭제
router.delete(
  "/:articleId",
  verifyAccessToken,
  articleController.deleteArticle
);

// 좋아요 
router.post('/:articleId/like', verifyAccessToken, articleController.likeArticle)

// 좋아요 취소
router.delete('/:articleId/like', verifyAccessToken, articleController.unlikeArticle)
export default router;
