const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

// Product Comments
router.route('/product/:productId/comment').get(commentController.getAllProductComments).post(commentController.createProductComment);

router.route('/product/:productId/comment/:commentId').patch(commentController.updateProductComment).delete(commentController.deleteProductComment);

// Article Comments
router.route('/article/:articleId/comment').get(commentController.getAllArticleComments).post(commentController.createArticleComment);

router.route('/article/:articleId/comment/:commentId').patch(commentController.updateArticleComment).delete(commentController.deleteArticleComment);

module.exports = router;
