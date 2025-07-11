import { db } from "../lib/db";
import { RegisterDto } from "../utils/dtos/auth.dto"

export const AuthRepository = {
  createUser: (data: RegisterDto & { password: string }) => {
    return db.user.create({
      data: {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      },
    });
  },

  findUserByEmail: (email: string) => {
    return db.user.findUnique({
      where: { email },
    });
  },

  findUserById: (id: number) => {
    return db.user.findUnique({
      where: { id },
    });
  },
};
