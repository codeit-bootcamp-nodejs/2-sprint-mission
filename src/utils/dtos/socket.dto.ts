export type JwtPayload = {
  sub: string | number;
  iat: number;
  exp: number;
};
