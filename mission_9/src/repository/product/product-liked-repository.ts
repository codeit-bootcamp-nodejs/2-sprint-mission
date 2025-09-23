import prisma from "../../utills/prisma";
import { Prisma } from "@prisma/client";
class ProductLikedRepository {
  static getProductLiked = async (userId: number) => {
    try {
      const productLiked = await prisma.productLiked.findMany({
        where: {
          userId: Number(userId),
        },
      });
      return productLiked;
    } catch(err) {
      throw err as Error;
    }
  }

  static getProductLikedById = async (userId: number, productId: number) => {
    const productLiked = await prisma.productLiked.findUnique({
      where: {
        userId_productId: {
          userId: Number(userId),
          productId: Number(productId),
        },
      },
    });
    return productLiked;
  }

  static createProductLiked = async (userId: number, productId: number) => {
    try {
      const newProductLiked = await prisma.productLiked.create({ data: { userId: Number(userId), productId: Number(productId) } });
      return newProductLiked;
    } catch(err) {
      return err as Error;
    }
  }

  static deleteProductLiked = async (userId: number, productId: number) => {
    try {
      const deletedProductLiked = await prisma.productLiked.delete({ where: { userId_productId: { userId: Number(userId), productId: Number(productId) } } });
      return deletedProductLiked;
    } catch(err) {
      return err as Error;
    }
  }
}

export default ProductLikedRepository;