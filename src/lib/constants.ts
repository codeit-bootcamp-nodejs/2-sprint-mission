// src/lib/constants.ts
import dotenv from 'dotenv';
dotenv.config();

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';
