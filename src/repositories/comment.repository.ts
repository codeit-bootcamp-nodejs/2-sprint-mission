import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CommentRepository = {
  // 댓글 생성
  createComment: async (data: {
    content: string;
    authorId: number;
    productId?: number | null;
    articleId?: number | null;
  }) => {
    return prisma.comment.create({ data });
  },

  // 상품 댓글 목록
  getProductComments: (productId: number, cursor?: number, take: number = 10) => {
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
  },

  // 게시글 댓글 목록
  getArticleComments: (articleId: number, cursor?: number, take: number = 10) => {
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
  },

  // 댓글 수정
  updateComment: (id: number, data: { content: string }) => {
    return prisma.comment.update({
      where: { id },
      data,
    });
  },

  // 댓글 삭제
  deleteComment: (id: number) => {
    return prisma.comment.delete({ where: { id } });
  },
};