const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/').get(productController.getAllProducts).post(productController.createProduct);

router
    .route('/:id')
    .get(productController.getProductById)
    .patch(upload.single('file'), productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;
