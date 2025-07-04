import { CreateArticle, UpdateArticleData, ArticleQuery } from '../types/article.ts';
import articleRepository from '../repositories/article.repository.ts';

const articleService = {
    getAllArticles: async (query: ArticleQuery) => {
        return await articleRepository.findAll(query);
    },

    getArticleById: async (userId: number, articleId: number) => {
        return await articleRepository.findByIdWithLike(userId, articleId);
    },

    createArticle: async (data: CreateArticle & { userId: number }) => {
        return await articleRepository.create(data);
    },

    updateArticle: async (userId: number, articleId: number, data: UpdateArticleData) => {
        const article = await articleRepository.findById(articleId);
        if (!article) {
            const error = new Error('수정할 게시글 없음');
            (error as any).status = 404;
            throw error;
        }
        if (article.userId !== userId) {
            const error = new Error('작성자 본인만 수정 가능');
            (error as any).status = 403;
            throw error;
        }

        return await articleRepository.update(articleId, data);
    },

    deleteArticle: async (userId: number, articleId: number) => {
        const article = await articleRepository.findById(articleId);
        if (!article) {
            const error = new Error('삭제할 게시글 없음');
            (error as any).status = 404;
            throw error;
        }
        if (article.userId !== userId) {
            const error = new Error('작성자 본인만 삭제 가능');
            (error as any).status = 403;
            throw error;
        }

        return await articleRepository.remove(articleId);
    },

    likeArticle: async (userId: number, articleId: number) => {
        return await articleRepository.like(userId, articleId);
    },

    unlikeArticle: async (userId: number, articleId: number) => {
        return await articleRepository.unlike(userId, articleId);
    },
};

export default articleService;
