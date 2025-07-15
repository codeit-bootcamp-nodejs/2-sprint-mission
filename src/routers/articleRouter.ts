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
} from '../controllers/articleController.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();

const articlesRouter = express.Router();

articlesRouter.post('/', authMiddleware, withAsync(createArticle));
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));
articlesRouter.patch('/:id', withAsync(updateArticle));
articlesRouter.delete('/:id', withAsync(deleteArticle));
articlesRouter.post('/:id/comments', withAsync(createComment));
articlesRouter.get('/:id/comments', withAsync(getCommentList));

export default  router;
