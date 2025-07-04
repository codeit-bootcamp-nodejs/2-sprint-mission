import express from 'express';
import passport from '../lib/passport/index.ts';

import authController from '../controllers/auth.controller.ts';

const router = express.Router();

// 회원가입
router.post('/register', authController.registerUser);

// 로그인
router.post('/login', passport.authenticate('local', { session: false }), authController.loginUser);

// 토큰 재발급
router.post('/refresh', authController.refreshToken);

export default router;
