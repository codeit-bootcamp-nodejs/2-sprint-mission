import db from "../config/db";
import {
  CreateProductCommentDto,
  UpdateProductCommentDto,
  ProductCommentResponseDto,
  CreateArticleCommentDto,
  UpdateArticleCommentDto,
  ArticleCommentResponseDto,
} from "../utils/dtos/comment.dto";

const commentRepository = {
  createProductComment: async (
    userId: number,
    productId: number,
    data: CreateProductCommentDto
  ): Promise<ProductCommentResponseDto> => {
    return await db.productComment.create({
      data: {
        content: data.content,
        userId,
        productId,
      },
    });
  },

  getAllProductComments: async (
    query: any
  ): Promise<ProductCommentResponseDto[]> => {
    const skip = Number(query.skip) || 0;
    const take = Number(query.limit) || 10;
    const keyword = query.keyword?.toString() ?? "";

    return await db.productComment.findMany({
      where: {
        content: { contains: keyword },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  updateProductComment: async (
    userId: number,
    commentId: number,
    data: UpdateProductCommentDto
  ): Promise<ProductCommentResponseDto> => {
    const comment = await db.productComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("댓글 없음");
    }

    if (comment.userId !== userId) {
      const error = new Error("작성자만 수정 가능");
      (error as any).status = 403;
      throw error;
    }
    return await db.productComment.update({
      where: { id: commentId },
      data: {
        content: data.content,
      },
    });
  },

  deleteProductComment: async (
    userId: number,
    productId: number,
    commentId: number
  ): Promise<void> => {
    const comment = await db.productComment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.productId !== productId) {
      throw new Error("해당 게시글의 댓글 아님");
    }

    if (comment.userId !== userId) {
      const error = new Error("작성자만 삭제 가능");
      (error as any).status = 403;
      throw error;
    }
    await db.productComment.delete({ where: { id: commentId } });
  },

  createArticleComment: async (
    userId: number,
    articleId: number,
    data: CreateArticleCommentDto
  ): Promise<ArticleCommentResponseDto> => {
    return await db.articleComment.create({
      data: {
        content: data.content,
        userId,
        articleId,
      },
    });
  },

  getAllArticleComments: async (
    query: any
  ): Promise<ArticleCommentResponseDto[]> => {
    const skip = Number(query.skip) || 0;
    const take = Number(query.limit) || 10;
    const keyword = query.keyword?.toString() ?? "";

    return await db.articleComment.findMany({
      where: {
        content: { contains: keyword },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  updateArticleComment: async (
    userId: number,
    commentId: number,
    data: UpdateArticleCommentDto
  ): Promise<ArticleCommentResponseDto> => {
    const comment = await db.articleComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("댓글 없음");
    }

    if (comment.userId !== userId) {
      const error = new Error("작성자만 수정 가능");
      (error as any).status = 403;
      throw error;
    }
    return await db.articleComment.update({
      where: { id: commentId },
      data: {
        content: data.content,
      },
    });
  },

  deleteArticleComment: async (
    userId: number,
    articleId: number,
    commentId: number
  ): Promise<void> => {
    const comment = await db.articleComment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.articleId !== articleId) {
      throw new Error("해당 게시글의 댓글 아님");
    }

    if (comment.userId !== userId) {
      const error = new Error("작성자만 삭제 가능");
      (error as any).status = 403;
      throw error;
    }
    await db.articleComment.delete({ where: { id: commentId } });
  },
};

export default commentRepository;
