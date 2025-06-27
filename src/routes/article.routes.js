// src/routes/article.routes.js
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { validateArticle } = require('../middlewares/validate');
const commentRoutes = require('./comment.routes'); 
const commentController = require('../controllers/comment.controller'); 


const { validateComment } = require('../middlewares/validate'); 

router
  .route('/')
  .post(validateArticle, articleController.createArticle)
  .get(articleController.getArticles);

router
  .route('/:id')
  .get(articleController.getArticles)
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

// 게시글에 대한 댓글 라우트
router.post('/:articleId/comments', validateComment, commentController.createArticleComment);
router.get('/:articleId/comments', commentController.getArticleComments);

// 게시글에 종속된 댓글 수정/삭제 라우트를 연결
router.use('/:articleId/comments', commentRoutes);

module.exports = router;