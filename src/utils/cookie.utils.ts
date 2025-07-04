import { Response } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, NODE_ENV } from '../lib/constants';

const Cookie = {
    setTokenCookies: (res: Response, accessToken: string, refreshToken: string) => {
        res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60, // 1시간
        });

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            path: '/auth/refresh',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
        });
    },
};

export default Cookie;
