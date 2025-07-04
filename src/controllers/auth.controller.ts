import db from '../config/db';
import { Request, Response, NextFunction } from 'express';
import Cookie from '../utils/cookie.utils.ts';
import authService from '../services/auth.service.ts';

import token from '../lib/token.ts';
const { verifyRefreshToken, generateTokens } = token;

const authController = {
    // 회원가입
    registerUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, nickname, password } = req.body;
            const user = await authService.registerUser({ email, nickname, password });

            // 비밀번호 제외하고 반환
            const { password: _, ...userWithoutPassword } = user;
            res.status(201).json({ message: '회원가입 완료', user: userWithoutPassword });
        } catch (error) {
            next(error);
        }
    },

    // 로그인
    loginUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'email/pw 확인바람' });
                return;
            }

            const { accessToken, refreshToken } = await authService.loginUser(req.user);

            Cookie.setTokenCookies(res, accessToken, refreshToken);

            res.status(200).json({
                message: '로그인 성공',
                accessToken,
                refreshToken,
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    nickname: req.user.nickname,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    // 토큰 재발급
    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies['refresh-token'];
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh Token 없음' });
                return;
            }

            // 토큰 검증 및 디코딩
            const { userId } = verifyRefreshToken(refreshToken);

            // DB에서 유저 존재 확인 + refreshToken 비교
            const user = await db.user.findUnique({ where: { id: userId } });
            if (!user || user.refreshToken !== refreshToken) {
                res.status(403).json({ message: '유효하지 않은 Refresh Token' });
                return;
            }

            // 토큰 재발급
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
            await db.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });

            Cookie.setTokenCookies(res, accessToken, newRefreshToken);

            res.status(200).json({ message: 'Access Token 재발급 성공' });
            return;
        } catch (error) {
            res.status(401).json({ message: '토큰 재발급 실패' });
            return;
        }
    },
};

export default authController;
