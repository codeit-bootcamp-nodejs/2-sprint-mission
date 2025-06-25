const bcrypt = require('bcrypt');
const { db } = require('../config/db');
const { generateTokens } = require('../lib/token');

// 회원가입
exports.registerUserService = async ({ email, nickname, password }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await db.user.create({
        data: { email, nickname, password: hashedPassword },
    });
    return user;
};

// 로그인
exports.loginUserService = async (user) => {
    const { accessToken, refreshToken } = generateTokens(user.id);

    // DB에 refreshToken 저장
    await db.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return { accessToken, refreshToken };
};
