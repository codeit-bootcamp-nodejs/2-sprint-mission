import { Prisma, PrismaClient } from "@prisma/client";
import { ArticleFindManyOptions } from "../dtos/articles.dto";

export class ArticleRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  async findManyArticles(options?: ArticleFindManyOptions) {
    return this.prisma.article.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });
  }

  async findManyByUserId(userId: number, options?: ArticleFindManyOptions) {
    return this.prisma.article.findMany({
      where: { userId },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });
  }

  async create(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({
      data,
    });
  }

  async update(id: number, data: Prisma.ArticleUpdateInput) {
    return this.prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.article.delete({
      where: { id },
    });
  }

  async updateLikeIncrease(id: number) {
    return this.prisma.article.update({
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
    return this.prisma.article.update({
      where: { id },
      data: {
        likeCount: { decrement: 1 },
      },
      select: { likeCount: true },
    });
  }
}
