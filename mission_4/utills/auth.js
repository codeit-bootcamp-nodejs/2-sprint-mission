import passport from '../lib/passport/index.js';
import dotenv from 'dotenv';
dotenv.config();


export const optionalAuth = (req, res, next) => {
  if(req.headers.cookie && req.headers.cookie.includes(process.env.ACCESS_TOKEN_COOKIE_NAME)) {
    passport.authenticate('access-token', { session: false, failWithError: true }, (err, user) => {
      if (err) { // 토큰 인증 에러시에도 진행
        return next();
      }
      if (user) { // 토큰 인증 성공시 진행
        req.user = user;
      }
      next();
    })(req, res, next);
  } else { // 토큰이 없으면 진행
    next(); 
  }
};
