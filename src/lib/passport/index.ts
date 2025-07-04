import passport from 'passport';
import localStrategy from './localStrategy.ts';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.ts';

passport.use('local', localStrategy); // 로그인용
passport.use('access-token', accessTokenStrategy); // 인증용
passport.use('refresh-token', refreshTokenStrategy); // 토큰 재발급용

export default passport;
