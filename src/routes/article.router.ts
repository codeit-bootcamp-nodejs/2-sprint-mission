import express from 'express';
import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticleList,
  likeArticle,
  unlikeArticle,
  getArticleLikes,
} from '../controllers/article.controller';
import { validateArticle } from '../middlewares/validation';
import { authenticate, optionalAuthenticate } from '../middlewares/auth';
import { requireOwnership } from '../middlewares/ownership';

const router: express.Router = express.Router();

router.get('/', getArticleList);
router.get('/:id', optionalAuthenticate, getArticleById);
// 좋아요 사용자 목록
router.get('/:articleId/likes', getArticleLikes);

router.use(authenticate);

// 생성
router.post('/', validateArticle, createArticle);

// 수정/삭제(작성자만)
router.patch('/:id', requireOwnership('article'), updateArticle);
router.delete('/:id', requireOwnership('article'), deleteArticle);

// 좋아요/취소
router.post('/:id/like', likeArticle);
router.delete('/:id/like', unlikeArticle);

export default router;