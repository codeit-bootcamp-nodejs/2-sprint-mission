const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
} = require('../controllers/product.controller');

// 상품 목록, 등록
router.route('/')
  .get(getProducts)         
  .post(createProduct);   

// 상품 조회, 수정, 삭제  
router.route('/:id')
  .get(getProductById)    
  .patch(updateProduct)   
  .delete(deleteProduct); 

module.exports = router;


