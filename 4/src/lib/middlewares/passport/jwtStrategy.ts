import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import db from '../../../model/prisma';
import { JWT_ACCESS_TOKEN_SECRET,JWT_REFRESH_TOKEN_SECRET} from '../../staticConsts';

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
  secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

const jwtVerify: VerifyCallback = async function (
  payload, 
  done
) {
  try {
    const user = await db.user.findUnique({
      where: { id: payload.sub },
    });
    
    if(user != null)
      return done(null, user);
    return done(null, false, {message: "user not found"});
  } catch (error) {
    return done(error, false, {message: "error from prisma/db"});
  }
}

const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);

export {
  accessTokenStrategy,
  refreshTokenStrategy
};
