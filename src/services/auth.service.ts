import bcrypt from 'bcrypt';
import db from '../config/db.ts';
import token from '../lib/token.ts';
const { generateTokens } = token;

import { RegisterUser } from '../types/auth.ts';

const authService = {
    // 회원가입
    registerUser: async ({ email, nickname, password }: RegisterUser) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await db.user.create({
            data: { email, nickname, password: hashedPassword },
        });
        return user;
    },

    // 로그인
    loginUser: async (user: { id: number }) => {
        const { accessToken, refreshToken } = generateTokens(user.id);

        // DB에 refreshToken 저장
        await db.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    },
};

export default authService;
