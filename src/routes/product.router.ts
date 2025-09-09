import express from 'express';
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductList,
  getProductLikes,
  likeProduct,
  unlikeProduct,
} from '../controllers/product.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth';
import { validateProduct } from '../middlewares/validation';
import { requireOwnership } from '../middlewares/ownership';

const router: express.Router = express.Router();
// 공개 API
router.get('/', getProductList);
router.get('/:id', optionalAuthenticate, getProductById);
router.get('/:productId/likes', getProductLikes);

router.use(authenticate);

// 생성
router.post('/', validateProduct, createProduct);

// 수정/삭제
router.patch('/:id', requireOwnership('product'), updateProduct);
router.delete('/:id', requireOwnership('product'), deleteProduct);

// 좋아요/취소
router.post('/:id/like', likeProduct);
router.delete('/:id/like', unlikeProduct);

export default router;
