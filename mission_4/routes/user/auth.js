import express from 'express';
import prisma from '../../utills/prisma.js';
import bcrypt from 'bcrypt';
import isemail from 'isemail';
import passport from '../../lib/passport/index.js';
import { generateTokens } from '../../utills/token.js';
import dotenv from 'dotenv';
import { loginLimiter } from '../../utills/loginLimiter.js';


dotenv.config();

const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.delete('/unregister', 
  passport.authenticate('access-token', { session: false }),
  unRegister)
authRouter.post('/login',
  loginLimiter,
  passport.authenticate('local', { session: false }),
  login)
authRouter.post('/refresh',
  passport.authenticate('refresh-token', { session: false }),
  refresh)
authRouter.post('/logout', logout)

async function register(req, res, next) {
  try {
    const { email, nickname, password } = req.body;
    if (!isemail.validate(email)) {
      return res.status(400).send('이메일 형식이 올바르지 않습니다.');
    }
    if (!password) {
      return res.status(400).send('비밀번호가 필요합니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },  
    });
    delete user.password;
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    next(err);
  }
}

async function unRegister(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id}});
    if (!user) {
      const err = new Error('user를 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return next(new Error('비밀번호가 일치하지 않습니다.'));
    }
    await prisma.user.delete({
      where: { id: req.user.id },
    });
    res.send({ message: 'user가 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { accessToken, refreshToken } = generateTokens(req.user.id);
    setTokenCookies(res, accessToken, refreshToken);
    res.status(200).json({ message: '로그인 성공' });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { accessToken, refreshToken } = generateTokens(req.user.id);
    setTokenCookies(res, accessToken, refreshToken);
    res.status(200).json({ message: 'refresh token 성공' });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME);
    res.status(200).json({ message: '로그아웃 성공' });
  } catch (err) {
    next(err);
  }
}

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });
  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export default authRouter;