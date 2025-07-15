import express from 'express';
import articleController from '../controllers/article/articleController';
import passport from '../lib/middlewares/passport';

const articleRouters = express.Router();

// article

articleRouters.get(
    '/',
    articleController.getArticlesListHandler
);

articleRouters.get(
    '/:id',
    articleController.getArticleByIdHandler
);

articleRouters.post(
    '/create',
    passport.authenticate('accessToken', { session: false }),
    articleController.createArticleHandler
);

articleRouters.patch(
    '/:id/update',
    passport.authenticate('accessToken', { session: false }),
    articleController.updateArticleHandler
);

articleRouters.delete(
    '/:id/delete',
    passport.authenticate('accessToken', { session: false }),
    articleController.deleteArticleHandler
);

export default articleRouters;