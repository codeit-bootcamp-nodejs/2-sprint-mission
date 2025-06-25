const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { ACCESS_SECRET, REFRESH_SECRET } = require('../lib/constants');

exports.loginService = async ({ email, password }) => {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    await db.user.update({ where: { id: user.id }, data: { refreshToken } });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        },
    };
};
