import { NotificationType, PrismaClient } from '@prisma/client';
import { CreateCommentInput, UpdateCommentInput } from '../dtos/comment.dto';
import { createAndPushNotification } from './notification.service';

const prisma = new PrismaClient();

export class CommentService {
  // 상품에 댓글 생성
  static async createProductComment(
    productId: number,
    authorId: number,
    data: CreateCommentInput
  ) {
    return prisma.comment.create({
      data: {
        ...data,
        authorId,
        productId,
        articleId: null,
      },
    });
  }

  // 게시글에 댓글 생성
  static async createArticleComment(
    articleId: number,
    authorId: number,
    data: CreateCommentInput
  ) {
    // 트랜잭션으로 게시글 검증 + 댓글 생성
    const { article, comment } = await prisma.$transaction(async (tx) => {
      const article = await tx.article.findUnique({
        where: { id: articleId },
        select: { id: true, title: true, authorId: true },
      });
      if (!article) throw new Error('Article not found');

      const comment = await tx.comment.create({
        data: {
          ...data,
          authorId,       // 댓글 작성자
          articleId,
          productId: null,
        },
      });

      return { article, comment };
    });

    // 알림 생성성
    if (article.authorId !== authorId) {
      await createAndPushNotification({
        userId: article.authorId,                   // 글 작성자에게 보냄
        type: NotificationType.NEW_COMMENT,
        title: '새 댓글이 달렸어요',
        message: `내 게시글 "${article.title}"에 새 댓글이 달렸습니다.`,        
        articleId,
        commentId: comment.id,
      });
    }

    return comment;
  }

  // 상품 댓글 목록
  static async getProductComments(productId: number, cursor?: number, take: number = 10) {
    return prisma.comment.findMany({
      where: { productId },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  // 게시글 댓글 목록
  static async getArticleComments(articleId: number, cursor?: number, take: number = 10) {
    return prisma.comment.findMany({
      where: { articleId },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  // 댓글 수정
  static async updateComment(commentId: number, data: UpdateCommentInput) {
    return prisma.comment.update({
      where: { id: commentId },
      data,
    });
  }

  // 댓글 삭제
  static async deleteComment(commentId: number) {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
