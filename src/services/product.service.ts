import { NotificationType, PrismaClient } from '@prisma/client';
import { createAndPushNotification } from './notification.service';

const prisma = new PrismaClient();

// 상품 생성
export class ProductService {
  static async createProduct(data: {
    name: string;
    description: string;
    price: number;
    tags: string[];
    imageUrl?: string;
    ownerId: number;
  }) {
    return prisma.product.create({ data });
  }

  // 상품 상세 조회
  static async getProductById(productId: number, userId?: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { likes: true },
    });

    if (!product) return null;

    const isLiked = userId
      ? product.likes.some((like) => like.userId === userId)
      : false;

    const likeCount = product.likes.length;

    const { likes, ...rest } = product;
    return { ...rest, isLiked, likeCount };
  }

  // 상품 수정
  static async updateProduct(productId: number, data: any) {
    // 트랜잭션으로 "이전 값"과 "수정 후"를 같이 확보
    const { before, after } = await prisma.$transaction(async (tx) => {
      const before = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, price: true },
      });
      if (!before) throw new Error('Product not found');

      const after = await tx.product.update({
        where: { id: productId },
        data,
      });

      return { before, after };
    });

    // 실제 값이 달라졌을 때만 알림
    const priceChanged = typeof data.price === 'number' && data.price !== before.price;

    if (priceChanged) {
      // 이 상품을 좋아요한 유저들 조회
      const likedUsers = await prisma.productLike.findMany({
        where: { productId },
        select: { userId: true },
      });

      // 알림 생성 + 실시간 알림림
      await Promise.all(
        likedUsers.map(({ userId }) =>
          createAndPushNotification({
            userId,
            type: NotificationType.PRICE_CHANGED,
            title: '관심 상품 가격 변동',
            message: `${before.name} 가격이 ${before.price.toLocaleString()} → ${after.price.toLocaleString()} 으로 변경되었어요.`,
            productId,
          })
        )
      );
    }

    return after;
  }

  // 상품 삭제
  static async deleteProduct(productId: number) {
    return prisma.product.delete({ where: { id: productId } });
  }

  // 상품 목록 조회
  static async getProductList(offset: number, limit: number, search: string) {
    return prisma.product.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        imageUrl: true,
      },
    });
  }

  // 상품 좋아요
  static async likeProduct(userId: number, productId: number) {
    return prisma.productLike.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      create: {
        userId,
        productId,
      },
      update: {},
    });
  }

  // 상품 좋아요 취소
  static async unlikeProduct(userId: number, productId: number) {
    return prisma.productLike.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  // 상품 좋아요 여부
  static async getProductLikes(productId: number) {
    const likes = await prisma.productLike.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return likes.map((like) => like.user);
  }
}