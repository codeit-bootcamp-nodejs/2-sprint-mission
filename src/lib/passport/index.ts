import passport from 'passport';
import { localStrategy } from './localStrategy';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy';

passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);
passport.use('local', localStrategy);

export default passport;