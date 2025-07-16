import { db } from "../lib/db";
import { UserUpdateDto } from "../utils/dtos/users.dto";

export const UserRepository = {
  findById: (id: number) => {
    return db.user.findUnique({
      where: { id },
    });
  },

  update: (id: number, data: UserUpdateDto) => {
    return db.user.update({
      where: { id },
      data,
      select: {
        nickname: true,
        image: true,
      },
    });
  },

  updatePassword: (id: number, hashedPassword: string) => {
    return db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  findMyProducts: (userId: number) => {
    return db.product.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        tags: true,
        createdAt: true,
      },
    });
  },

  findMyProductsLike: (userId: number) => {
    return db.productLike.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            tags: true,
            createdAt: true,
          },
        },
      },
    });
  },
};
