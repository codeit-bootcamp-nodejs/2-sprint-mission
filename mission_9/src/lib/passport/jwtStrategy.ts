import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import prisma from '../../utills/prisma';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const accessTokenOptions = {
  jwtFromRequest: (req: express.Request) => req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string],
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
};

const refreshTokenOptions = {
  jwtFromRequest: (req: express.Request) => req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string],
  secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET as string,
};

const jwtVerify = async (payload: passport.payload, done: VerifiedCallback) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      return done(null, false);
    }
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
