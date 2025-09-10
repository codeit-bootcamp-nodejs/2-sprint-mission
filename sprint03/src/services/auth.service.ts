import { AuthRepository } from "../repositories/auth.repository";
import { hashPassword } from "../utils/hash.password";
import { comparePassword } from "../utils/compare.password";
import { generateTokens, verifyRefreshToken } from "../lib/token";
import HttpError from "../types/httpError";
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
} from "../utils/dtos/auth.dto";

export const AuthService = {
  register: async (data: RegisterDto) => {
    const hashedPassword = await hashPassword(data.password);

    const user = await AuthRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  login: async (data: LoginDto) => {
    const user = await AuthRepository.findUserByEmail(data.email);
    if (!user) throw new HttpError(401, "이메일이 틀렸습니다.");

    const isPasswordValid = await comparePassword(
      data.password,
      user.password
    );
    if (!isPasswordValid) throw new HttpError(401);

    const { accessToken, refreshToken } = generateTokens(user.id);

    return {
      accessToken,
      refreshToken,
    };
  },

  refreshAccessToken: async (dto: RefreshTokenDto) => {
    if (!dto.refreshToken)
      throw new HttpError(401, "Refresh Token이 없습니다.");

    const { userId } = verifyRefreshToken(dto.refreshToken);

    const user = await AuthRepository.findUserById(userId);
    if (!user) throw new HttpError(404);

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = generateTokens(user.id);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },
};
