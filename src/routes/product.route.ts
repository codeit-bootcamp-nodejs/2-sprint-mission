const express = require('express');
const passport = require('../lib/passport/index');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const productController = require('../controllers/product.controller');

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
