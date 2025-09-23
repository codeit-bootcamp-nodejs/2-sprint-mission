import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
} from '../controllers/articlesController.js';
import { authMiddleware } from '../middlewares/auth.js'; // ★ 추가

const articlesRouter = express.Router();

// 게시글 등록/수정/삭제 (로그인 필수)
articlesRouter.post('/', authMiddleware, withAsync(createArticle));
articlesRouter.patch('/:id', authMiddleware, withAsync(updateArticle));
articlesRouter.delete('/:id', authMiddleware, withAsync(deleteArticle));

// 게시글 목록/상세조회 (로그인 X)
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));

// 게시글 댓글 등록 (로그인 필수)
articlesRouter.post('/:id/comments', authMiddleware, withAsync(createComment));
// 게시글 댓글 조회 (로그인 X)
articlesRouter.get('/:id/comments', withAsync(getCommentList));

export default articlesRouter;
