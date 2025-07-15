import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from '../controllers/productsController.js';

import authMiddleware from '../middlewares/auth.middleware.js';


const productsRouter = express.Router();
//const authMiddleware = require('../middlewares/auth.middleware');

 productsRouter.post('/',     authMiddleware, withAsync(createProduct));        // 상품 등록: 로그인 필수
 productsRouter.get('/:id',    withAsync(getProduct));                         // 상품 상세 조회: 공개
 productsRouter.patch('/:id',  authMiddleware, withAsync(updateProduct));       // 상품 수정: 로그인 필수
 productsRouter.delete('/:id', authMiddleware, withAsync(deleteProduct));      // 상품 삭제: 로그인 필수
 productsRouter.get('/',       withAsync(getProductList)); 
 productsRouter.post('/:id/comments', authMiddleware, withAsync(createComment)); // 댓글 작성: 로그인 필수
productsRouter.get('/:id/comments',  withAsync(getCommentList));     

export default productsRouter;
