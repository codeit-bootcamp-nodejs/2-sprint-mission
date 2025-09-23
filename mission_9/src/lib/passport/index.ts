import passport from "passport";
import { accessTokenStrategy, refreshTokenStrategy } from "./jwtStrategy";

passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

export default passport;