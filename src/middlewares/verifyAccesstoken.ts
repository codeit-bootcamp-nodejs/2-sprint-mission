import passport from "../lib/passport";

export const verifyAccessToken = passport.authenticate("jwt", {
  session: false,
});
