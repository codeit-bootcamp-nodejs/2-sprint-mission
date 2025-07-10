// JWT 전략 정의 (passport-jwt)
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { jwtOptions } from './constants';
import authRepository from '../../repositories/auth.repository';

const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload, done: VerifiedCallback) => {
    try {
      // payload: JWT의 decode된 결과
      if (payload && payload.sub) {
        const user = await authRepository.findUserById(payload.sub);

        if (user) {
          return done(null, user); // req.user에 들어갈 값
        }
        return done(null, false);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }
);

export default jwtStrategy;
