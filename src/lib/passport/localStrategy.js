const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { db } = require('../../config/db');

const localStrategy = new LocalStrategy(
    {
        usernameField: 'email', // 프론트에서 보내는 필드명과 일치해야 함
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const user = await db.user.findUnique({ where: { email } });
            if (!user) return done(null, false, { message: 'Incorrect email' });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return done(null, false, { message: 'Incorrect password' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);

// ✅ 전략을 내보낼 때 이름 지정
localStrategy.name = 'local'; // ← 이게 핵심 포인트!

module.exports = localStrategy;
