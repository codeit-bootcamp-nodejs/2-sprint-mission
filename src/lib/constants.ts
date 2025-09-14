import dotenv from 'dotenv';

export const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV == 'production') {
    dotenv.config();
}

export const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || '';
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || '';
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
export const AWS_REGION = process.env.AWS_REGION || '';
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || '';
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || '';
export const ENABLE_AWS_S3 = ((process.env.ENABLE_AWS_S3 == '1') ? true : false) || false;