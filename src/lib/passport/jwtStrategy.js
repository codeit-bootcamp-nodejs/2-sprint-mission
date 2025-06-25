const { Strategy : JwtStrategy } = require('passport-jwt');
const { db } = require('../../config/db.js');
const { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = require('../constants.js');

const accessTokenOptions = {
    jwtFromRequest: (req) => req.cookies[ACCESS_TOKEN_COOKIE_NAME], // 쿠키에서 토큰 추출
    secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
    jwtFromRequest: (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

// Access/Refresh Token이 유효한지 확인 후, payload에 들어있는 sub로 DB에서 사용자 찾아 req.user에 저장
async function jwtVerify(payload, done) {
    try {
        const user = await db.user.findUnique({
            where: { id: payload.sub },
        });
        done(null, user); // 인증 성공 → req.user = user
    } catch (error) {
        done(error, false);
    }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);

const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

module.exports = { accessTokenStrategy, refreshTokenStrategy };
