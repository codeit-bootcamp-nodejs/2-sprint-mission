import express from 'express';
import articleLikedService from '../service/article/article-liked-service';
import articleCommentService from '../service/article/article-comment-service';
import articleService from '../service/article/article-service';
import { optionalAuth } from '../utills/auth';
import passport from '../lib/passport/index';

export const articleRoute = express.Router();



//articleCommentRoute
articleRoute.get('/comment', articleCommentService.getArticleComments);
articleRoute.post('/:articleId/comment',
  passport.authenticate('access-token', { session: false }),
  articleCommentService.createArticleComment);
articleRoute.patch('/comment/:commentId',
  passport.authenticate('access-token', { session: false }),
  articleCommentService.updateArticleComment);
articleRoute.delete('/comment/:commentId',
  passport.authenticate('access-token', { session: false }),
  articleCommentService.deleteArticleComment);

//articleLikedRoute
articleRoute.get('/:articleId/liked',
  passport.authenticate('access-token', { session: false }),
  articleLikedService.getArticleLiked);
articleRoute.post('/:articleId/liked',
  passport.authenticate('access-token', { session: false }),
  articleLikedService.createArticleLiked);
articleRoute.delete('/:articleId/liked',
  passport.authenticate('access-token', { session: false }),
  articleLikedService.deleteArticleLiked);
  
//articleroute
articleRoute.get('', 
  optionalAuth,
  articleService.getArticles);
articleRoute.get('/:articleId',
  optionalAuth,
  articleService.getArticleById);
articleRoute.post('/',
  passport.authenticate('access-token', { session: false }),
  articleService.createArticle);
articleRoute.patch('/:articleId',
  passport.authenticate('access-token', { session: false }),
  articleService.updateArticle);
articleRoute.delete('/:articleId',
  passport.authenticate('access-token', { session: false }),
  articleService.deleteArticle);
