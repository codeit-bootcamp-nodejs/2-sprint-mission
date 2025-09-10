import { PrismaClient } from "@prisma/client";

export class ArticleLikeRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findManyByUserId(userId: number) {
    return this.prisma.articleLike.findMany({
      where: {
        userId,
      },
      select: { articleId: true },
    });
  }

  async checkingArticleLikeStatus(userId: number, articleId: number) {
    return this.prisma.articleLike.findFirst({
      where: {
        userId,
        articleId,
      },
    });
  }

  async deleteArticleLike(id: number) {
    return this.prisma.articleLike.delete({
      where: { id },
    });
  }

  async uploadArticleLike(userId: number, articleId: number) {
    return this.prisma.articleLike.create({
      data: {
        userId,
        articleId,
      },
    });
  }
}
