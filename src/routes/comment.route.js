const express = require('express');
const passport = require('../lib/passport/index');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

// Product Comments
router
    .route('/product/:productId/comment')
    .get(commentController.getAllProductComments)
    .post(passport.authenticate('access-token', { session: false }), commentController.createProductComment);

router
    .route('/product/:productId/comment/:commentId')
    .patch(passport.authenticate('access-token', { session: false }), commentController.updateProductComment)
    .delete(passport.authenticate('access-token', { session: false }), commentController.deleteProductComment);

// Article Comments
router
    .route('/article/:articleId/comment')
    .get(commentController.getAllArticleComments)
    .post(passport.authenticate('access-token', { session: false }), commentController.createArticleComment);

router
    .route('/article/:articleId/comment/:commentId')
    .patch(passport.authenticate('access-token', { session: false }), commentController.updateArticleComment)
    .delete(passport.authenticate('access-token', { session: false }), commentController.deleteArticleComment);

module.exports = router;
