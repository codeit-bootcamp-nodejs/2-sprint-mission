import { ArticleRepository } from "../repositories/article.repository";
import { CommentRepository } from "../repositories/comment.repository";
import { AuthRepository } from "../repositories/auth.repository"
import HttpError from "../types/httpError";
import { CommentCreateDto, CommentUpdateDto } from "../utils/dtos/comments.dto";
import { notificationService } from "./notification.service";



export const CommentService = {
  getArticleComments: async (articleId: number, cursor?: number, limit?: number) => {
    const comments = await CommentRepository.findArticleComments(articleId, cursor, limit);
    const nextCursor =
      comments.length === Number(limit) ? comments[comments.length - 1].id : null;

    return { comments, nextCursor };
  },

  createArticleComment: async (articleId: number, userId: number, data: CommentCreateDto) => {
    const comment =  await CommentRepository.createArticleComment(articleId, userId, data);
    
    const article = await ArticleRepository.findById(articleId)
      if (!article) throw new HttpError(404);


    const commentAuthor =  await AuthRepository.findUserById(userId)
      if (!commentAuthor) throw new HttpError(404);

    // 다른사람이 댓글 달면 알림
    if (article.userId !== userId) {
      await notificationService.notify(
        article.userId,
        "comment",
        `${commentAuthor.nickname}님이 당신의 게시글에 댓글을 남겼습니다.`
      );
    }
    return comment;
  },

  updateArticleComment: async (id: number, data: CommentUpdateDto) => {
    const existingComment = await CommentRepository.findArticleCommentById(id);
    if (!existingComment) throw new HttpError(404);

    return await CommentRepository.updateArticleComment(id, data);
  },

  deleteArticleComment: async (id: number) => {
    const existingComment = await CommentRepository.findArticleCommentById(id);
    if (!existingComment) throw new HttpError(404);

    return await CommentRepository.deleteArticleComment(id);
  },

  getProductComments: async (productId: number, cursor?: number, limit?: number) => {
    const comments = await CommentRepository.findProductComments(productId, cursor, limit);
    const nextCursor =
      comments.length === Number(limit) ? comments[comments.length - 1].id : null;

    return { comments, nextCursor };
  },

  createProductComment: async (productId: number, userId: number, data: CommentCreateDto) => {
    return await CommentRepository.createProductComment(productId, userId, data);
  },

  updateProductComment: async (id: number, data: CommentUpdateDto) => {
    const existingComment = await CommentRepository.findProductCommentById(id);
    if (!existingComment) throw new HttpError(404);

    return await CommentRepository.updateProductComment(id, data);
  },

  deleteProductComment: async (id: number) => {
    const existingComment = await CommentRepository.findProductCommentById(id);
    if (!existingComment) throw new HttpError(404);

    return await CommentRepository.deleteProductComment(id);
  },
};
