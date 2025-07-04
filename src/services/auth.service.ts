import bcrypt from 'bcrypt';
import token from '../lib/token.ts';
const { generateTokens } = token;

import authRepository from '../repositories/auth.repository.ts';

import { RegisterUser } from '../types/auth.ts';

const authService = {
    // 회원가입
    registerUser: async ({ email, nickname, password }: RegisterUser) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await authRepository.registerUser(email, nickname, hashedPassword);
        return user;
    },

    // 로그인
    loginUser: async (user: { id: number }) => {
        const { accessToken, refreshToken } = generateTokens(user.id);

        // DB에 refreshToken 저장
        await authRepository.updateUserRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    },

    // 리프레시 토큰 검증 후 사용자 조회 및 재발급
    reissueToken: async (refreshToken: string) => {
        const { userId } = token.verifyRefreshToken(refreshToken);
        const user = await authRepository.findUserById(userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('유효하지 않은 리프레시 토큰');
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
        await authRepository.updateUserRefreshToken(user.id, newRefreshToken);

        return { accessToken, refreshToken: newRefreshToken };
    },
};

export default authService;
