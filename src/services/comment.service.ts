import commentRepository from "../repositories/comment.repository";
import { CreateProductCommentDto, UpdateProductCommentDto, CreateArticleCommentDto, UpdateArticleCommentDto, ProductCommentResponseDto, ArticleCommentResponseDto } from "../utils/dtos/comment.dto";

const commentService = {
  createProductComment: async (
    userId: number,
    productId: number,
    data: CreateProductCommentDto
  ): Promise<ProductCommentResponseDto> => {
    return await commentRepository.createProductComment(
      userId,
      productId,
      data
    );
  },

  getAllProductComments: async (query: any ): Promise<ProductCommentResponseDto[]> => {
    return await commentRepository.getAllProductComments(query);
  },

  updateProductComment: async (
    userId: number,
    commentId: number,
    data: UpdateProductCommentDto
  ): Promise<ProductCommentResponseDto> => {
    return await commentRepository.updateProductComment(userId, commentId, data);
  },

  deleteProductComment: async (userId: number, productId: number, commentId: number): Promise<void> => {
    await commentRepository.deleteProductComment(userId, productId, commentId);
  },

  createArticleComment: async (userId: number, articleId:number, data: CreateArticleCommentDto): Promise<ArticleCommentResponseDto> => {
    return await commentRepository.createArticleComment(userId, articleId, data)
  },

  getAllArticleComments: async (query: any): Promise<ArticleCommentResponseDto[]> => {
    return await commentRepository.getAllArticleComments(query)
  },

  updateArticleComment: async (userId: number, commentId: number, data: UpdateArticleCommentDto): Promise<ArticleCommentResponseDto> => {
    return await commentRepository.updateArticleComment(userId, commentId, data)
  },

  deleteArticleComment: async (userId:number, articleId: number, commentId: number): Promise<void> => {
    await commentRepository.deleteArticleComment(userId, articleId, commentId)
  }
};

export default commentService;