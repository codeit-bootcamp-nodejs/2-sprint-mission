import { db } from '../utils/db';

export const userRepository = {
  createUser: (data: { email: string; nickname: string; password: string }) =>
    db.user.create({ data }),

  findByNickname: (nickname: string) =>
    db.user.findUnique({ where: { nickname } }),

  findById: (id: number) =>
    db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    }),

 updateUser: (
  userId: number, // access token에서 추출된 id
  data: { email?: string; nickname?: string; image?: string; password?: string }
) =>
  db.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    }
  }),

  findProductsByUserId: (userId: number) =>
    db.product.findMany({ where: { userId } }),
};
