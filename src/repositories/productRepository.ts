import { Prisma, PrismaClient } from "@prisma/client";
import { ProductFindManyOptions } from "../dtos/products.dto";

export class ProductRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findManyProducts(options?: ProductFindManyOptions) {
    return this.prisma.product.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });
  }

  async findManyByUserId(userId: number, options?: ProductFindManyOptions) {
    return this.prisma.product.findMany({
      where: { userId },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateLikeIncrease(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: {
        likeCount: { increment: 1 },
      },
      select: {
        likeCount: true,
      },
    });
  }

  async updateLikeDecrease(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: {
        likeCount: { decrement: 1 },
      },
      select: { likeCount: true },
    });
  }
}
