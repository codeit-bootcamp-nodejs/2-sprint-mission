import prisma from "../../utills/prisma";
import { Prisma } from "@prisma/client";
class ProductRepository {
  static getProducts = async (offset: number, limit: number, orderBy: { createdAt: 'asc' | 'desc' }, search: string | undefined, select: Prisma.ProductSelect) => {
    try {
      const products = await prisma.product.findMany({
        skip: offset,
        take: limit,
        orderBy: orderBy,
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' }},
            { description: { contains: search, mode: 'insensitive' }},
          ],
        },
        select: select,
      });
      return products;
    } catch(err) {
      return err as Error;
    }
  }

  static getProductByIdOrThrow = async (productId: number, select: Prisma.ProductSelect | null = null) => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productId
      },
      select: {
        ...select,
        productLiked: true,
        productComments: true,
        user: true,
      },
    });
    return product;
  }

  static createProduct = async (product:Prisma.ProductCreateInput) => {
    try {
      const newProduct = await prisma.product.create({ data: product });
      return newProduct;
    } catch(err) {
      return err as Error;
    }
  }

  static updateProduct = async (id: number, product:Prisma.ProductUpdateInput) => {
    try {
      const updatedProduct = await prisma.product.update({ where: { id: id }, data: product });
      return updatedProduct;
    } catch(err) {
      return err as Error;
    }
  }

  static deleteProduct = async (id: number) => {
    try {
      const deletedProduct = await prisma.product.delete({ where: { id: id } });
      return deletedProduct;
    } catch(err) {
      return err as Error;
    }
  }

  static getUserProducts = async (userId: number) => {
    try {
      const products = await prisma.product.findMany({ where: { userId: userId } });
      return products;
    } catch(err) {
      return err as Error;
    }
  }
}
  
export default ProductRepository;