import prisma from "../../utills/prisma";
import { Prisma } from "@prisma/client";

class ProductCommentRepository {
  static getProductComments = async (cursor: number | undefined, orderBy: { createdAt: 'asc' | 'desc' }, search: string | undefined) => {
    try {
      const comments = await prisma.productComment.findMany({
        take: 3,
        orderBy: orderBy,
        where: {
          content: search ? { contains: search, mode: 'insensitive' } : undefined,
        },
        select: {
          id: true, 
          content: true,
          createdAt: true,
        },
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
      });
      return comments;
    } catch(err) {
      return err as Error;
    }
  }

  static getProductCommentByIdOrThrow = async (productId: number) => {
    const productComment = await prisma.productComment.findUniqueOrThrow({
      where: {
        id: productId
      },
      select: {
        product: true,
        user: true,
      },
    });
    return productComment;
  }

  static createProductComment = async (productComment:Prisma.ProductCommentCreateInput) => {
    try {
      const newProductComment = await prisma.productComment.create({ data: productComment });
      return newProductComment;
    } catch(err) {
      return err as Error;
    }
  }

  static updateProductComment = async (id: number, productComment:Prisma.ProductCommentUpdateInput) => {
    try {
      const updatedProductComment = await prisma.productComment.update({ where: { id: id }, data: productComment });
      return updatedProductComment;
    } catch(err) {
      return err as Error;
    }
  }

  static deleteProductComment = async (id: number) => {
    try {
      const deletedProductComment = await prisma.productComment.delete({ where: { id: id } });
      return deletedProductComment;
    } catch(err) {
      return err as Error;
    }
  }
}

export default ProductCommentRepository;