const express = require('express');
const router = express.Router();

const {
  createArticleComment,
  getArticleComments,
  updateArticleComment,
  deleteArticleComment
} = require('../controllers/article.comment.controller');

router.route('/:articletId')
  .get(getArticleComments)
  .post(createArticleComment);

router.route('/:articleId/:commentId')
  .patch(updateArticleComment)
  .delete(deleteArticleComment);


module.exports = router;
