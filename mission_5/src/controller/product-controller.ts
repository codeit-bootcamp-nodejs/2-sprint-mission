import express from 'express';
import productLikedService from '../service/product/product-liked-service';
import productCommentService from '../service/product/product-comment-service';
import productService from '../service/product/product-service';
import passport from '../lib/passport/index';
import { optionalAuth } from '../utills/auth';
const productController = express.Router();


//productCommentRoute
productController.get('/comment', productCommentService.getProductComments);
productController.post('/:productId/comment',
  passport.authenticate('access-token', { session: false }),
  productCommentService.createProductComment);
productController.patch('/comment/:commentId',
  passport.authenticate('access-token', { session: false }),
  productCommentService.updateProductComment);
productController.delete('/comment/:commentId',
  passport.authenticate('access-token', { session: false }),
  productCommentService.deleteProductComment);

//productLikedRoute
productController.get('/:productId/liked',
  passport.authenticate('access-token', { session: false }),
  productLikedService.getProductLiked);
productController.post('/:productId/liked',
  passport.authenticate('access-token', { session: false }),
  productLikedService.createProductLiked);
productController.delete('/:productId/liked',
  passport.authenticate('access-token', { session: false }),
  productLikedService.deleteProductLiked);

//productRoute
productController.get('/', optionalAuth, productService.getProducts);
productController.get('/:productId', optionalAuth, productService.getProductById);
productController.post('/',
  passport.authenticate('access-token', { session: false }),
  productService.createProduct);
productController.patch('/:productId',
  passport.authenticate('access-token', { session: false }),
  productService.updateProduct);
productController.delete('/:productId',
  passport.authenticate('access-token', { session: false }),
  productService.deleteProduct);

export default productController;