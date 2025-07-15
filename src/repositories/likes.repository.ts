import { prismaClient } from '../lib/prismaClient';

type LikeTargetType = 'product' | 'article';

export const likeRepository = {
  // 좋아요 생성
  create: (data: { userId: number; targetType: LikeTargetType; targetId: number }) => {
    return prismaClient.like.create({ data });
  },

  // 좋아요 조회
  find: ({ userId, targetType, targetId }: { userId: number; targetType: LikeTargetType; targetId: number }) => {
    return prismaClient.like.findFirst({
      where: {
        userId,
        targetType,
        targetId,
      },
    });
  },

  // 좋아요 삭제
  remove: (id: number) => {
    return prismaClient.like.delete({ where: { id } });
  },

  // 유저가 좋아요한 상품 목록
  findLikedProducts: (userId: number) => {
    return prismaClient.like.findMany({
      where: {
        userId,
        targetType: 'product',
      },
      include: {
        product: true,
      },
    });
  },

  // 유저가 좋아요한 게시글 목록
  findLikedArticles: (userId: number) => {
    return prismaClient.like.findMany({
      where: {
        userId,
        targetType: 'article',
      },
      include: {
        article: true,
      },
    });
  },
};
