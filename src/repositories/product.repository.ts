import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }

  async countLikes(productId: number): Promise<number> {
    return prisma.productLike.count({
      where: { productId },
    });
  }

  async isLikedByUser(productId: number, userId: number): Promise<boolean> {
    const like = await prisma.productLike.findFirst({
      where: { productId, userId },
    });
    return !!like;
  }

  async likeProduct(productId: number, userId: number) {
    return prisma.productLike.create({
      data: { productId, userId },
    });
  }

  async unlikeProduct(productId: number, userId: number) {
    return prisma.productLike.deleteMany({
      where: { productId, userId },
    });
  }
}
