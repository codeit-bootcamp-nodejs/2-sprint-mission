import createArticleHandler from './createArticleHandler';
import deleteArticleHandler from './deleteArticleHandler';
import getArticleByIdHandler from './getArticleByIdHandler';
import getArticlesListHandler from './getArticlesListHandler';
import updateArticleHandler from './updateArticleHandler';

const articleController = {
    getArticlesListHandler,
    getArticleByIdHandler,
    createArticleHandler,
    updateArticleHandler,
    deleteArticleHandler
};

export default articleController;