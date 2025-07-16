import { UserRepository } from "../repositories/user.repository";
import HttpError from "../types/httpError";
import { comparePassword } from "../utils/compare.password";
import { hashPassword } from "../utils/hash.password";
import { UserUpdateDto, ChangePasswordDto } from "../utils/dtos/users.dto";

export const UserService = {
  getUserInfo: async (userId: number) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new HttpError(404);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  updateUserInfo: async (userId: number, data: UserUpdateDto) => {
    return await UserRepository.update(userId, data);
  },

  changeUserPassword: async (userId: number, dto: ChangePasswordDto) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new HttpError(404);

    const isValid = await comparePassword(dto.currentPassword, user.password);
    if (!isValid) throw new HttpError(401);

    const hashedNewPassword = await hashPassword(dto.newPassword);

    await UserRepository.updatePassword(userId, hashedNewPassword);
  },

  getMyProducts: async (userId: number) => {
    return await UserRepository.findMyProducts(userId);
  },

  getMyProductsLike: async (userId: number) => {
    const likes = await UserRepository.findMyProductsLike(userId);
    const products = likes.map((like) => like.product);
    return products;
  },
};
