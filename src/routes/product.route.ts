import express from 'express';
import passport from '../lib/passport/index.ts';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

import productController from '../controllers/product.controller.ts'

const router = express.Router();

router
    .route('/')
    .get(productController.getAllProducts)
    .post(passport.authenticate('access-token', { session: false }), productController.createProduct);

router
    .route('/:id')
    .get(passport.authenticate('access-token', { session: false }), productController.getProductById)
    .patch(upload.single('file'), passport.authenticate('access-token', { session: false }), productController.updateProduct)
    .delete(passport.authenticate('access-token', { session: false }), productController.deleteProduct);

// 상품 좋아요♥️, 좋아요❌
router
    .route('/:productId/like')
    .post(passport.authenticate('access-token', { session: false }), productController.likeProduct)
    .delete(passport.authenticate('access-token', { session: false }), productController.unlikeProduct);

export default router;
