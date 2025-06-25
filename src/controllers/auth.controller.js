const { registerUserService } = require('../services/auth.service');

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
        console.error('❌ 회원가입 에러', error);
        return next(error);
    }
};
