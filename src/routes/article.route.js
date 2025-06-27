const express = require('express');
const passport = require('../lib/passport/index');
const router = express.Router();
const articleController = require('../controllers/article.controller');

router
    .route('/')
    .get(articleController.getAllArticles)
    .post(passport.authenticate('access-token', { session: false }), articleController.createArticle);

router
    .route('/:id')
    .get(passport.authenticate('access-token', { session: false }), articleController.getArticleById)
    .patch(passport.authenticate('access-token', { session: false }), articleController.updateArticle)
    .delete(passport.authenticate('access-token', { session: false }), articleController.deleteArticle);

router
    .route('/:articleId/like')
    .post(passport.authenticate('access-token', { session: false }), articleController.likeArticle)
    .delete(passport.authenticate('access-token', { session: false }), articleController.unlikeArticle);

module.exports = router;
