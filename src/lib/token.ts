import jwt from 'jsonwebtoken';
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
} from "./constants";
import { Request, Response } from 'express';

//access, refresh 토큰 생성 
export function generateTokens(userId: number) {
    const accessToken = jwt.sign({ sub: userId },
        JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: userId },
        JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' });
    return { accessToken, refreshToken };
}

//accessToken 확인
export function verifyAccessToken(token: string) {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.sub };
}

//refreshToken 확인
export function verifyRefreshToken(token: string) {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.sub };
}

//브라우저 쿠키에 토큰 저장 
export function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        maxAge: 1 * 60 * 60 * 1000,
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        path: '/refresh',
    });
}

//만료 토큰 갱신 
export async function refreshTokens(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user;
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user.id
    );
    setTokenCookies(res, accessToken, newRefreshToken);
    res.status(200).send();
};

export function clearTokenCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}