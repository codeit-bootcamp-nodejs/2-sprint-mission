import express from 'express';
import productRouter from './product/product.js';
import articleRouter from './article/article.js';
import articleCommentRouter from './article/articleComment.js';
import productCommentRouter from './product/productComment.js';
import fileRouter from './file.js';
import authRouter from './user/auth.js';
import userRouter from './user/user.js';
import productLikedRouter from './product/productLiked.js';
import articleLikedRouter from './article/articleLiked.js';
const router = express.Router();

router.use('/product', productRouter);
router.use('/article', articleRouter);
router.use('/articleComment', articleCommentRouter);
router.use('/productComment', productCommentRouter);
router.use('/file', fileRouter);
router.use('/file', express.static('uploads'));
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/productLiked', productLikedRouter);
router.use('/articleLiked', articleLikedRouter);

export default router;