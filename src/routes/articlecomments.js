const express = require('express');
const router = express.Router();

const {
  createArticleComment,
  getArticleComments,
  updateArticleComment,
  deleteArticleComment
} = require('../controllers/article.comment.controller');

// 댓글 목록, 작성
router.route('/:articletId')
  .get(getArticleComments)
  .post(createArticleComment);

// 댓글 수정, 삭제
router.route('/:articleId/:commentId')
  .patch(updateArticleComment)
  .delete(deleteArticleComment);


module.exports = router;
