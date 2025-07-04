import express from 'express';
import passport from '../lib/passport/index.ts';

import articleController from '../controllers/article.controller.ts';

const router = express.Router();

router
    .route('/')
    .get(articleController.getAllArticles)
    .post(passport.authenticate('access-token', { session: false }), articleController.createArticle);

router
    .route('/:id')
    .get(passport.authenticate('access-token', { session: false }), articleController.getArticleById)
    .patch(passport.authenticate('access-token', { session: false }), articleController.updateArticle)
    .delete(passport.authenticate('access-token', { session: false }), articleController.deleteArticle);

// 게시글 좋아요♥️, 좋아요❌
router
    .route('/:articleId/like')
    .post(passport.authenticate('access-token', { session: false }), articleController.likeArticle)
    .delete(passport.authenticate('access-token', { session: false }), articleController.unlikeArticle);

export default router;
