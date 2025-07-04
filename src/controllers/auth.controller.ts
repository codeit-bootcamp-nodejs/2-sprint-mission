import { Request, Response, NextFunction } from 'express';
import Cookie from '../utils/cookie.utils.ts';
import authService from '../services/auth.service.ts';

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

            // 토큰 재발급
            const { accessToken, refreshToken: newRefreshToken } = await authService.reissueToken(refreshToken);
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
