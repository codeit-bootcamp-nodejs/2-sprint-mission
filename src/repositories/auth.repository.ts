import db from "../config/db";
import { RegisterUserDto } from "../utils/dtos/auth.dto";

const authRepository = {
  findUserByEmail: async (email: string) => {
    return await db.user.findUnique({ where: { email } });
  },

  findUserById: async (id: number) => {
    return await db.user.findUnique({ where: { id } });
  },

  createUser: async (data: RegisterUserDto) => {
    return await db.user.create({ data });
  },

  saveRefreshToken: async (userId: number, refreshToken: string) => {
    return await db.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  },

  deleteRefreshToken: async (userId: number) => {
    return await db.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },
};

export default authRepository;
