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
    .get(productController.getProductById)
    .patch(upload.single('file'), passport.authenticate('access-token', { session: false }), productController.updateProduct)
    .delete(passport.authenticate('access-token', { session: false }), productController.deleteProduct);

module.exports = router;
