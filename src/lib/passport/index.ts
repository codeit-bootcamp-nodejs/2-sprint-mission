// passport 초기화 및 strategy 등록
import passport from "passport";
import jwtStrategy from "./jwtStrategy";

passport.use(jwtStrategy);

export default passport;
