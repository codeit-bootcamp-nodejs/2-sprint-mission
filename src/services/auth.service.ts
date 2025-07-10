import bcrypt from "bcrypt";
import authRepository from "../repositories/auth.repository";
import { generateTokens, verifyRefreshToken } from "../lib/token";
import {
  LoginUserDto,
  LoginUserResponseDto,
  RegisterUserDto,
  RegisterUserResponseDto,
} from "../utils/dtos/auth.dto";


const authService = {
  registerUser: async (
    userData: RegisterUserDto
  ): Promise<RegisterUserResponseDto> => {
    const hashed = await bcrypt.hash(userData.password, 10);
    const createdUser = await authRepository.createUser({
      ...userData,
      password: hashed,
    });

    // 비밀번호를 제외한 객체 반환
    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  },

  loginUser: async (data: LoginUserDto): Promise<LoginUserResponseDto> => {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new Error("이메일 불일치");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("비밀번호 불일치");
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    await authRepository.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    };
  },

  logout: async (userId: number) => {
    await authRepository.deleteRefreshToken(userId);
  },

  reissueAccessToken: async (refreshToken: string) => {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      const error = new Error("유효하지 않은 Refresh Token");
      (error as any).status = 401;
      throw error;
    }

    const userId = (payload as any).sub;

    const user = await authRepository.findUserById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error("Refresh Token 일치하지 않음");
      (error as any).status = 401;
      throw error;
    }

    const { accessToken } = generateTokens(user.id); // refresh는 재사용
    return {
      accessToken,
      user: { id: user.id, email: user.email, nickname: user.nickname },
    };
  },
};

export default authService;
