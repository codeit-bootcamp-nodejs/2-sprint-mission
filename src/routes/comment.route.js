const express = require('express');
const passport = require('../lib/passport/index');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

// 상품 댓글
router
    .route('/product/:productId/comment')
    .get(commentController.getAllProductComments)
    .post(passport.authenticate('access-token', { session: false }), commentController.createProductComment);

router
    .route('/product/:productId/comment/:commentId')
    .patch(passport.authenticate('access-token', { session: false }), commentController.updateProductComment)
    .delete(passport.authenticate('access-token', { session: false }), commentController.deleteProductComment);

// 게시글 댓글
router
    .route('/article/:articleId/comment')
    .get(commentController.getAllArticleComments)
    .post(passport.authenticate('access-token', { session: false }), commentController.createArticleComment);

router
    .route('/article/:articleId/comment/:commentId')
    .patch(passport.authenticate('access-token', { session: false }), commentController.updateArticleComment)
    .delete(passport.authenticate('access-token', { session: false }), commentController.deleteArticleComment);

module.exports = router;
