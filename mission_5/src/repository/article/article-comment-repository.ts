import prisma from "../../utills/prisma";
import { Prisma } from "@prisma/client";

class ArticleCommentRepository {
  static getArticleCommentByIdOrThrow = async (articleCommentId: number) => {
    const articleComment = await prisma.articleComment.findUniqueOrThrow({
      where: {
        id: articleCommentId
      }
    });
    return articleComment;
  }
  static getArticleCommentlist = async (orderBy: { createdAt: 'asc' | 'desc' }, cursor?: number) => {
    try {
      const comments = await prisma.articleComment.findMany({
        take: 3,
        orderBy: orderBy,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
      });
    return comments;
  } catch(err) {
    return err as Error;
  }
}

  static createArticleComment = async (articleComment: Prisma.ArticleCommentCreateInput) => {
    try {
      const newComment = await prisma.articleComment.create({ data: articleComment });
      return newComment;
    } catch(err) {
      return err as Error;
    }
  }

  static updateArticleComment = async (articleComment: Prisma.ArticleCommentUpdateInput, articleCommentId: number) => {
    try {
      const updatedComment = await prisma.articleComment.update({
        data: articleComment,
        where: { id: articleCommentId }
      });
      return updatedComment;
    } catch(err) {
      return err as Error;
    }
  }

  static deleteArticleComment = async (articleCommentId: number) => {
    try {
      const deletedComment = await prisma.articleComment.delete({ where: { id: articleCommentId } });
      return deletedComment;
    } catch(err) {
      return err as Error;
    }
  }
}

export default ArticleCommentRepository;