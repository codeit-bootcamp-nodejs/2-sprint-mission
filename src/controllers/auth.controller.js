const { db } = require('../config/db');
const { verifyRefreshToken, generateTokens } = require('../lib/token');
const { registerUserService, loginUserService } = require('../services/auth.service');
const { setTokenCookies } = require('../utils/cookie.utils');

// 회원가입 컨트롤러
exports.registerUserController = async (req, res, next) => {
    try {
        const { email, nickname, password } = req.body;
        const user = await registerUserService({ email, nickname, password });

        // 비밀번호 제외하고 반환
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ message: `Successfully registered`, user: userWithoutPassword });
        console.log(`user`, user);
    } catch (error) {
        console.error('회원가입 ❌', error);
        return next(error);
    }
};

// 로그인 컨트롤러
exports.loginController = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { accessToken, refreshToken } = await loginUserService(req.user);

        setTokenCookies(res, accessToken, refreshToken);

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: req.user.id,
                email: req.user.email,
                nickname: req.user.nickname,
            },
        });
    } catch (error) {
        console.error('로그인 ❌', error);
    }
};

// 토큰 재발급
exports.refreshTokenController = async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refresh-token'];
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh Token이 없습니다.' });
        }

        // 토큰 검증 및 디코딩
        const { userId } = verifyRefreshToken(refreshToken);

        // DB에서 유저 존재 확인 + refreshToken 비교
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: '유효하지 않은 Refresh Token 입니다.' });
        }

        // 토큰 재발급
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
        await db.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });

        setTokenCookies(res, accessToken, newRefreshToken);

        res.status(200).json({ message: 'Access Token이 재발급되었습니다' });
    } catch (error) {
        console.error('토큰 재발급 오류 ❌', error);
        return res.status(401).json({ message: '토큰 재발급 실패' });
    }
};
