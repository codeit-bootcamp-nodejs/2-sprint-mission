import passport from '../lib/passport/index';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();


export const optionalAuth: express.RequestHandler = (req, res, next) => {
  if(req.headers.cookie && req.headers.cookie.includes(process.env.ACCESS_TOKEN_COOKIE_NAME as string)) {
    passport.authenticate('access-token', { session: false, failWithError: true }, (err: Error, user: any) => {
      if (user) { // 토큰 인증 성공시 진행
        req.user = user;
      }
      next();
    })(req, res, next);
  } else { // 토큰이 없으면 진행
    next(); 
  }
};
