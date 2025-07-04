import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';
import { DecodedToken } from '../types/token.ts';

function generateTokens(userId: number): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ sub: userId.toString() }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ sub: userId.toString() }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
    return { accessToken, refreshToken };
}

function verifyAccessToken(token: string): { userId: number } {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as DecodedToken;
    return { userId: Number(decoded.sub) };
}

function verifyRefreshToken(token: string): { userId: number } {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as DecodedToken;
    return { userId: Number(decoded.sub) };
}

export default { generateTokens, verifyAccessToken, verifyRefreshToken };
