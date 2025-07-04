import { Request as ExpressRequest } from 'express';
import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import db from '../../config/db.ts';

import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from '../constants.ts';

// 타입을 명시적으로 확장
interface CustomRequest extends ExpressRequest {
    cookies: {
        [key: string]: string;
    };
}

const accessTokenOptions = {
    jwtFromRequest: (req: CustomRequest) => req.cookies[ACCESS_TOKEN_COOKIE_NAME], // 쿠키에서 토큰 추출
    secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
    jwtFromRequest: (req: CustomRequest) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

// Access/Refresh Token이 유효한지 확인 후, payload에 들어있는 sub로 DB에서 사용자 찾아 req.user에 저장
// 🫠 타입을 이렇게 작성하는게 맞아....?
const jwtVerify:VerifiedCallback = async (payload: any, done: any)  => {
    try {
        const user = await db.user.findUnique({
            where: { id: payload.sub },
        });
        done(null, user); // 인증 성공 → req.user = user
    } catch (error) {
        done(error, false);
    }
}

export const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);

export const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);
