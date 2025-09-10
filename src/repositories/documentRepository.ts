import { Prisma, PrismaClient } from "@prisma/client";

export class DocumentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async findById(id: number) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.DocumentCreateInput) {
    return this.prisma.document.create({
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
