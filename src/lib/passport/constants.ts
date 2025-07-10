// JWT 관련 상수 (secret, 옵션 등)
export const ACCESS_SECRET =
  process.env.ACCESS_SECRET || "default_access_secret";

export const jwtOptions = {
  secretOrKey: ACCESS_SECRET,
  jwtFromRequest: (req: any) => req.cookies?.accessToken || null,
};
