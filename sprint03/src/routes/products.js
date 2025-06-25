import { Router } from 'express';

import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
} from '../controllers/product.controller.js';

const router = Router();

// 상품 목록, 등록
router.route('/')
  .get(getProducts)
  .post(createProduct);

// 상품 조회, 수정, 삭제
router.route('/:id')
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
