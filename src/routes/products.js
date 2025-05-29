const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
} = require('../controllers/product.controller');

router.route('/')
  .get(getProducts)       
  .post(createProduct);   

router.route('/:id')
  .get(getProductById)    
  .patch(updateProduct)   
  .delete(deleteProduct); 

module.exports = router;




module.exports = router;
