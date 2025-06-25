const express = require('express');
const passport = require('../lib/passport/index');
const { registerUserController, loginController } = require('../controllers/auth.controller');

const router = express.Router();

// 회원가입
router.post('/register', registerUserController);

// 로그인
router.post('/login', passport.authenticate('local', { session: false }), loginController);

module.exports = router;
