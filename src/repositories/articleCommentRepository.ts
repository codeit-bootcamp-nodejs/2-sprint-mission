import { Prisma, PrismaClient } from "@prisma/client";

export class ArticleCommentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number) {
    return this.prisma.articleComment.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ArticleCommentCreateInput) {
    return this.prisma.articleComment.create({ data });
  }

  async update(id: number, data: Prisma.ArticleCommentUpdateInput) {
    return this.prisma.articleComment.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.articleComment.delete({
      where: { id },
    });
  }
}
