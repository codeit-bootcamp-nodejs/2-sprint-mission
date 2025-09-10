import { Prisma, PrismaClient } from "@prisma/client";

export class ProductCommentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number) {
    return this.prisma.productComment.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ProductCommentCreateInput) {
    return this.prisma.productComment.create({ data });
  }

  async update(id: number, data: Prisma.ProductCommentUpdateInput) {
    return this.prisma.productComment.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.productComment.delete({
      where: { id },
    });
  }
}
