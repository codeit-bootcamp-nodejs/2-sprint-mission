const passport = require('passport');
const { db } = require('../../config/db');
const localStrategy  = require('./localStrategy');
const { accessTokenStrategy, refreshTokenStrategy } = require('./jwtStrategy');

passport.use('local', localStrategy); // 로그인용
passport.use('access-token', accessTokenStrategy); // 인증용
passport.use('refresh-token', refreshTokenStrategy); // 토큰 재발급용

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const user = await db.user.findUnique({ where: { id } });
    done(null, user);
});

module.exports = passport;
