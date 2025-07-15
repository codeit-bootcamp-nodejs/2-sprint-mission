import createArticle from './createArticle';
import deleteArticle from './deleteArticle';
import getArticleById from './getArticleById';
import getArticlesList from './getArticlesList';
import updateArticle from './updateArticle';

const articleService = {
    getArticlesList,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};

export default articleService;