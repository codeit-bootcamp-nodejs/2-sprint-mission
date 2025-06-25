const { db } = require('../config/db');
const { registerUserService, loginUserService } = require('../services/auth.service');
const {setTokenCookies} = require('../utils/cookie.utils')

// 회원가입 컨트롤러
exports.registerUserController = async (req, res, next) => {
    try {
        console.log('✅ 회원가입 요청 들어옴');
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
