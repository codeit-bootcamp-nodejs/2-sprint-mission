import { Prisma } from "@prisma/client";
import { UserRepository } from "../repositories/userReporitory";
import bcrypt from "bcrypt";
import { generateTokens } from "../lib/token";
import { CreateUserDto, PatchUserDto, UserOutputDto } from "../dtos/users.dto";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserProfile(userId: number): Promise<UserOutputDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async registerUser(userData: CreateUserDto): Promise<UserOutputDto> {
    //1. 이메일 중복 확인
    const existingEmail = await this.userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error(
        "Email already exist! Please Change to something else"
      );
    }

    //2. 닉네임 중복 확인
    const existingNickname = await this.userRepository.findByNickname(
      userData.nickname
    );
    if (existingNickname) {
      throw new Error(
        "Nickname already exist! Please Change to something else"
      );
    }

    //3. 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = await this.userRepository.create({
      email: userData.email,
      nickname: userData.nickname,
      password: hashedPassword,
      image: userData.image,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  async generateAuthTokens(userId: number) {
    const { accessToken, refreshToken } = generateTokens(userId);
    return { accessToken, refreshToken };
  }

  async updateUser(
    userId: number,
    updateData: PatchUserDto
  ): Promise<UserOutputDto> {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(
        updateData.password as string,
        salt
      );
    }
    try {
      const userUpdateData: Prisma.UserUpdateInput = {};

      if (updateData.email !== undefined) {
        userUpdateData.email = updateData.email;
      }
      if (updateData.nickname !== undefined) {
        userUpdateData.nickname = updateData.nickname;
      }
      if (updateData.password !== undefined) {
        userUpdateData.password = updateData.password;
      }

      if (updateData.image !== undefined) {
        userUpdateData.image = updateData.image;
      }

      const updatedUser = await this.userRepository.update(
        userId,
        userUpdateData
      );

      if (!updatedUser) {
        throw new Error("User not found or update failed");
      }

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          "Email or User nickname already exist! Please Change to something else"
        );
      }
      throw error;
    }
  }

  async deleteUser(userId: number) {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(userId);
    return { message: "User deleted successfully" };
  }
}
