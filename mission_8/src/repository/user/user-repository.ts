import prisma from "../../utills/prisma";
import { Prisma } from "@prisma/client";

class UserRepository {
  static getUserById = async (userId: number) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user;
    } catch (err) {
      return err as Error;
    }
  }

  static getUserByEmail = async (email: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { email: email } });
      return user;
    } catch (err) {
      return err as Error;
    }
  }

  static createUser = async (data: Prisma.UserCreateInput) => {
    try {
      const newUser = await prisma.user.create({ data: data });
      return newUser;
    } catch (err) {
      return err as Error;
    }
  }

  static deleteUser = async (userId: number) => {
    try {
      const deletedUser = await prisma.user.delete({ where: { id: userId } });
      return deletedUser;
    } catch (err) {
      return err as Error;
    }
  }

  static updateUser = async (userId: number, data: Prisma.UserUpdateInput) => {
    try {
      const updatedUser = await prisma.user.update({ where: { id: userId }, data: data });
      return updatedUser;
    } catch (err) {
      return err as Error;
    }
  }
}

export default UserRepository;