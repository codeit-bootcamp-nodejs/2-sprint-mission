const express = require('express');
const passport = require('../lib/passport/index');
const { registerUserController, loginController, refreshTokenController } = require('../controllers/auth.controller');

const router = express.Router();

// 회원가입
router.post('/register', registerUserController);

// 로그인
router.post('/login', passport.authenticate('local', { session: false }), loginController);

// 토큰 재발급
router.post('/refresh', refreshTokenController);

module.exports = router;
