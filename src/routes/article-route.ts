import express from 'express';
import authenticate from '../middlewares/authenticate';
import ArticleController from '../controllers/article-controller';

const router = express.Router();

router.get('/detail/:id', ArticleController.getDetail.bind(ArticleController));
router.get('/list', ArticleController.getArticleList.bind(ArticleController));
router.post('/create', authenticate, ArticleController.createArticle.bind(ArticleController));
router.patch('/change/:id', authenticate, ArticleController.changeArticle.bind(ArticleController));
router.delete('/remove/:id', authenticate, ArticleController.deleteArticle.bind(ArticleController));
router.post('/likes/:articleId', authenticate, ArticleController.articleLike.bind(ArticleController));
router.delete('/likesCancel/:articleId', authenticate, ArticleController.articleLikeCancel.bind(ArticleController));
router.get('/isLiked', authenticate, ArticleController.isLikedArticleList.bind(ArticleController));

export default router;
