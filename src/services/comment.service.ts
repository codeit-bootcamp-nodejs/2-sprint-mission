import commentRepository from '../repositories/comment.repository.ts';
import {
    CreateProductComment,
    UpdateProductComment,
    CreateArticleComment,
    UpdateArticleComment,
    ProductCommentQuery,
    ArticleCommentQuery,
} from '../types/comment.ts';

const commentService = {
    getAllProductComments: async (productId: number | string, query: ProductCommentQuery) => {
        return await commentRepository.getAllProductComments(productId, query);
    },

    createProductComment: async (data: CreateProductComment) => {
        return await commentRepository.createProductComment(data);
    },

    updateProductComment: async (data: UpdateProductComment) => {
        return await commentRepository.updateProductComment(data);
    },

    deleteProductComment: async (userId: number, productId: number, commentId: number) => {
        return await commentRepository.deleteProductComment(userId, productId, commentId);
    },

    getAllArticleComments: async (articleId: number | string, query: ArticleCommentQuery) => {
        return await commentRepository.getAllArticleComments(articleId, query);
    },

    createArticleComment: async (data: CreateArticleComment) => {
        return await commentRepository.createArticleComment(data);
    },

    updateArticleComment: async (data: UpdateArticleComment) => {
        return await commentRepository.updateArticleComment(data);
    },

    deleteArticleComment: async (userId: number, articleId: number, commentId: number) => {
        return await commentRepository.deleteArticleComment(userId, articleId, commentId);
    },
};

export default commentService;
