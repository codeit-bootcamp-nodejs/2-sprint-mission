import dotenv from 'dotenv';

dotenv.config();

export const JWT_REFRESH_TOKEN_SECRET: string = process.env.JWT_REFRESH_TOKEN_SECRET || 'your_jwt_refresh_token_secret';
export const JWT_ACCESS_TOKEN_SECRET: string = process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_access_token_secret';
export const ACCESS_TOKEN_COOKIE_NAME: string = 'access-token'
export const REFRESH_TOKEN_COOKIE_NAME: string = 'refresh-token';

