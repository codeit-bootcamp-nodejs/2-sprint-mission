const express = require('express');
const router = express.Router();

const {
  createProductComment,
  getProductComments,
  updateProductComment,
  deleteProductComment
} = require('../controllers/product.comment.controller');

// 댓글 목록, 작성
router.route('/:productId')
  .get(getProductComments)
  .post(createProductComment);

// 댓글 수정, 삭제
router.route('/:productId/:commentId')
  .patch(updateProductComment)
  .delete(deleteProductComment);

module.exports = router;
