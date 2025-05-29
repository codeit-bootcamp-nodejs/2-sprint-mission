const express = require('express');
const router = express.Router();

const {
  createProductComment,
  getProductComments,
  updateProductComment,
  deleteProductComment
} = require('../controllers/product.comment.controller');

router.route('/:productId')
  .get(getProductComments)
  .post(createProductComment);

router.route('/:productId/:commentId')
  .patch(updateProductComment)
  .delete(deleteProductComment);

module.exports = router;
