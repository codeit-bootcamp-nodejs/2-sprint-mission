import { Strategy as JwtStrategy } from 'passport-jwt';
import prisma from '../../utills/prisma.js';
import dotenv from 'dotenv';
dotenv.config();

const accessTokenOptions = {
  jwtFromRequest: (req) => req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME],
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: (req) => req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME],
  secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
};

async function jwtVerify(payload, done) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}

export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);
