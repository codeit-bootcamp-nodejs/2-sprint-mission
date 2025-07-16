import { db } from "../lib/db";
import { ProductCreateDto, ProductUpdateDto } from "../utils/dtos/products.dto";

export const ProductRepository = {
  findMany: (where: any, skip: number, take: number, orderBy?: any) => {
    return db.product.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
  },

  findById: (id: number) => {
    return db.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });
  },

  create: (data: ProductCreateDto & { userId: number }) => {
    return db.product.create({
      data,
    });
  },

  update: (id: number, data: ProductUpdateDto) => {
    return db.product.update({
      where: { id },
      data,
    });
  },

  delete: (id: number) => {
    return db.product.delete({
      where: { id },
    });
  },

  findLike: (userId: number, productId: number) => {
    return db.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  },

  createLike: (userId: number, productId: number) => {
    return db.productLike.create({
      data: {
        userId,
        productId,
      },
    });
  },

  deleteLike: (userId: number, productId: number) => {
    return db.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  },
};
