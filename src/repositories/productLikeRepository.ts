import { PrismaClient } from "@prisma/client";
import { LikedProductFindManyOptions } from "../dtos/products.dto";

export class ProductLikeRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findManyByUserId(userId: number) {
    return this.prisma.productLike.findMany({
      where: {
        userId,
      },
      select: { productId: true },
    });
  }

  async findUsersByProductId(productId: number) {
    const likedUsers = await this.prisma.productLike.findMany({
      where: { productId },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    return likedUsers.map((entry) => entry.user);
  }

  async findLikedProductsByUserId(
    userId: number,
    options?: LikedProductFindManyOptions
  ) {
    return this.prisma.productLike.findMany({
      where: {
        userId,
      },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            userId: true,
            likeCount: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async checkingProductLikeStatus(userId: number, productId: number) {
    return this.prisma.productLike.findFirst({
      where: {
        userId,
        productId,
      },
    });
  }

  async deleteProductLike(id: number) {
    return this.prisma.productLike.delete({
      where: { id },
    });
  }

  async uploadProductLike(userId: number, productId: number) {
    return this.prisma.productLike.create({
      data: {
        userId,
        productId,
      },
    });
  }
}
