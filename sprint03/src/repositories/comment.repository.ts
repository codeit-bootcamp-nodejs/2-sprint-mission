import { db } from "../lib/db";
import { CommentCreateDto, CommentUpdateDto } from "../utils/dtos/comments.dto";

export const CommentRepository = {
  findArticleComments: (
    articleId: number,
    cursor?: number,
    limit: number = 10
  ) => {
    return db.articleComment.findMany({
      where: { articleId },
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      take: limit,
      orderBy: { id: "asc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
  },

  createArticleComment: (articleId: number, userId: number, data: CommentCreateDto) => {
    return db.articleComment.create({
      data: {
        content: data.content,
        article: { connect: { id: articleId } },
        user: { connect: { id: userId } },
      },
    });
  },

  findArticleCommentById: (id: number) => {
    return db.articleComment.findUnique({
      where: { id },
    });
  },

  updateArticleComment: (id: number, data: CommentUpdateDto) => {
    return db.articleComment.update({
      where: { id },
      data,
    });
  },

  deleteArticleComment: (id: number) => {
    return db.articleComment.delete({
      where: { id },
    });
  },

  findProductComments: (
    productId: number,
    cursor?: number,
    limit: number = 10
  ) => {
    return db.productComment.findMany({
      where: { productId },
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      take: limit,
      orderBy: { id: "asc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
  },

  createProductComment: (productId: number, userId: number, data: CommentCreateDto) => {
    return db.productComment.create({
      data: {
        content: data.content,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
    });
  },

  findProductCommentById: (id: number) => {
    return db.productComment.findUnique({
      where: { id },
    });
  },

  updateProductComment: (id: number, data: CommentUpdateDto) => {
    return db.productComment.update({
      where: { id },
      data,
    });
  },

  deleteProductComment: (id: number) => {
    return db.productComment.delete({
      where: { id },
    });
  },
};
