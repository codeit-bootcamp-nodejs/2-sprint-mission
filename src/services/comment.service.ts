import commentRepository from "../repositories/comment.repository";
import articleRepository from "../repositories/article.repository";
import productRepository from "../repositories/product.repository";
import notificationService from "../services/notification.service";
import { NotificationType } from "@prisma/client";
import db from "../config/db";
import {
  CreateProductCommentDto,
  UpdateProductCommentDto,
  CreateArticleCommentDto,
  UpdateArticleCommentDto,
  ProductCommentResponseDto,
  ArticleCommentResponseDto,
} from "../utils/dtos/comment.dto";

// 미리보기
const preview = (v: string, n = 100) =>
  v.length > n ? v.slice(0, n) + "…" : v;

const commentService = {
  // 상품 댓글 생성 : 트랜잭션으로 저장 -> 커밋 후 알림 생성, 소켓 발송
  createProductComment: async (
    userId: number,
    productId: number,
    data: CreateProductCommentDto
  ): Promise<ProductCommentResponseDto> => {
    // 댓글 저장
    const created = await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });
      if (!product) throw { status: 404, message: "상품을 찾을 수 없습니다." };

      return await commentRepository.createProductCommentTx(
        tx,
        userId,
        productId,
        data
      );
    });

    // 커밋 후 대상 조회
    const productCore = await productRepository.getProductCoreById(productId);
    const ownerId: number | undefined = productCore?.userId;

    // 자기 댓글 스킵
    if (!ownerId || ownerId === userId) return created;

    // 알림 생성 → 소켓 전송
    await notificationService.createAndEmit({
      userId: ownerId,
      type: NotificationType.PRODUCT_COMMENT,
      title: "내 상품에 댓글이 달렸습니다.",
      message: `${created.userId ?? "누군가"}: ${preview(created.content)}`,
      meta: { productId, commentId: created.id },
    });

    return created;
  },

  getAllProductComments: async (
    query: any
  ): Promise<ProductCommentResponseDto[]> => {
    return await commentRepository.getAllProductComments(query);
  },

  updateProductComment: async (
    userId: number,
    commentId: number,
    data: UpdateProductCommentDto
  ): Promise<ProductCommentResponseDto> => {
    return await commentRepository.updateProductComment(
      userId,
      commentId,
      data
    );
  },

  deleteProductComment: async (
    userId: number,
    productId: number,
    commentId: number
  ): Promise<void> => {
    await commentRepository.deleteProductComment(userId, productId, commentId);
  },

  // 게시글 댓글 생성
  async createArticleComment(
    userId: number,
    articleId: number,
    data: CreateArticleCommentDto
  ): Promise<ArticleCommentResponseDto> {
    // 댓글 저장
    const created = await db.$transaction(async (tx) => {
      const article = await tx.article.findUnique({
        where: { id: articleId },
        select: { id: true },
      });
      if (!article)
        throw { status: 404, message: "게시글을 찾을 수 없습니다." };

      return await commentRepository.createArticleCommentTx(
        tx,
        userId,
        articleId,
        data
      );
    });

    // 커밋 후, 게시글 작성자 조회
    const authorId = await articleRepository.getArticleAuthorId(articleId);
    console.log("[article-comment] authorId:", authorId, "commenter:", userId);

    // 자기 댓글 스킵
    if (!authorId || authorId === userId) return created;

    // 알림 레코드 생성 → 소켓 전송
    await notificationService.createAndEmit({
      userId: authorId,
      type: NotificationType.ARTICLE_COMMENT,
      title: "내 게시글에 댓글이 달렸습니다.",
      message: `${created.userId ?? "누군가"}: ${preview(created.content)}`,
      meta: { articleId, commentId: created.id },
    });

    return created;
  },

  getAllArticleComments: async (
    query: any
  ): Promise<ArticleCommentResponseDto[]> => {
    return await commentRepository.getAllArticleComments(query);
  },

  updateArticleComment: async (
    userId: number,
    commentId: number,
    data: UpdateArticleCommentDto
  ): Promise<ArticleCommentResponseDto> => {
    return await commentRepository.updateArticleComment(
      userId,
      commentId,
      data
    );
  },

  deleteArticleComment: async (
    userId: number,
    articleId: number,
    commentId: number
  ): Promise<void> => {
    await commentRepository.deleteArticleComment(userId, articleId, commentId);
  },
};

export default commentService;
