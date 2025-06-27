// src/routes/comment.routes.js (수정된 내용)
const express = require('express');
const router = express.Router({ mergeParams: true }); 
const commentController = require('../controllers/comment.controller');
const { validateComment } = require('../middlewares/validate');

// 공통 댓글 수정/삭제 (여전히 :id 를 사용)
router
  .route('/:id') // 여기서 :id는 댓글 자체의 ID를 의미합니다.
  .patch(validateComment, commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;