import express from 'express';
import prisma from '../../utills/prisma';
import bcrypt from 'bcrypt';
import isemail from 'is-email';
import { generateTokens } from '../../utills/token';
import dotenv from 'dotenv';
import UserRepository from '../../repository/user/user-repository';
dotenv.config();

class AuthService {
  static register: express.RequestHandler = async (req, res, next) => {
    try {
      const { email, nickname, password } = req.body;
      if (!email) {
        res.status(400).send('이메일이 필요합니다.');
        return;
      }
      if (!isemail(email)) {
        res.status(400).send('이메일 형식이 올바르지 않습니다.');
        return;
      }
      if (!password) {
        res.status(400).send('비밀번호가 필요합니다.');
        return;
      }
      if (!nickname) {
        res.status(400).send('닉네임이 필요합니다.');
        return;
      }
      const emailUser = await UserRepository.getUserByEmail(email);
      if (emailUser) {
        res.status(400).send('이메일이 중복됩니다.');
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserRepository.createUser({
        email,
        nickname,
        password: hashedPassword,
      });
      res.status(201).json({ message: '회원가입 성공' });
    } catch (err) {
      next(err);
    }
  }

  static unRegister: express.RequestHandler = async (req, res, next) => {
    try {
      const user = await UserRepository.getUserById(req.user!.id);
      if (user instanceof Error) {
        return next(user);
      } 
      const isMatch = await bcrypt.compare(req.body.password, user!.password);
      if (!isMatch) {
        res.status(401).send('비밀번호가 일치하지 않습니다.');
        return;
      }
      await UserRepository.deleteUser(req.user!.id);
      res.status(200).send({ message: 'user가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  }

  static login: express.RequestHandler = async (req, res, next) => {
    try {
      const user = await UserRepository.getUserByEmail(req.body!.email);
      if (!user) {
        res.status(404).send('user를 찾을 수 없습니다.');
        return;
      }
      if (user instanceof Error) {
        return next(user);
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        res.status(401).send('비밀번호가 일치하지 않습니다.');
        return;
      }
      const { accessToken, refreshToken } = generateTokens(user.id);
      AuthService.setTokenCookies(res, accessToken, refreshToken);
      res.status(200).json({ message: '로그인 성공' });
    } catch (err) {
      next(err);
    }
  }

  static refresh: express.RequestHandler = async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = generateTokens(req.user!.id);
      AuthService.setTokenCookies(res, accessToken, refreshToken);
      res.status(200).json({ message: 'refresh token 성공' });
    } catch (err) {
      next(err);
    }
  }

  static logout: express.RequestHandler = async (req, res, next) => {
    try {
      res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME as string);
      res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string);
      res.status(200).json({ message: '로그아웃 성공' });
    } catch (err) {
      next(err);  
    }
  }

  static setTokenCookies = (res: express.Response, accessToken: string, refreshToken: string) => {
    res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME as string, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}

export default AuthService;