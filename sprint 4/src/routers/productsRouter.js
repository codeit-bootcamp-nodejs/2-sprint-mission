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
  likeProduct,      
  unlikeProduct,    
} from '../controllers/productsController.js';
import { authMiddleware } from '../middlewares/auth.js';

const productsRouter = express.Router();

productsRouter.post('/', authMiddleware, withAsync(createProduct));
productsRouter.patch('/:id', authMiddleware, withAsync(updateProduct));
productsRouter.delete('/:id', authMiddleware, withAsync(deleteProduct));

productsRouter.get('/', withAsync(getProductList));
productsRouter.get('/:id', withAsync(getProduct));


productsRouter.post('/:id/like', authMiddleware, withAsync(likeProduct));
productsRouter.delete('/:id/like', authMiddleware, withAsync(unlikeProduct));

productsRouter.post('/:id/comments', authMiddleware, withAsync(createComment));
productsRouter.get('/:id/comments', withAsync(getCommentList));

export default productsRouter;
