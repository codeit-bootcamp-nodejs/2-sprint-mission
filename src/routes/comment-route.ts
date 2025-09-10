import express from 'express';
import authenticate from '../middlewares/authenticate';
import CommentController from '../controllers/comment-controller';

const router = express.Router();

// 댓글 등록
router.post('/product/create', authenticate, CommentController.createProductComment.bind(CommentController));
router.post('/article/create', authenticate, CommentController.createArticleComment.bind(CommentController));

// 댓글 수정
router.patch('/change/:id', authenticate, CommentController.changeComment.bind(CommentController));

// 댓글 삭제
router.delete('/remove/:id', authenticate, CommentController.deleteComment.bind(CommentController));

// 댓글 목록 조회
router.get('/product/list', CommentController.getProductCommentList.bind(CommentController));
router.get('/article/list', CommentController.getArticleCommentList.bind(CommentController));

export default router;
