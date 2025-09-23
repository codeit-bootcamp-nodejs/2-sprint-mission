import dotenv from 'dotenv';

// 환경에 따라 다른 .env 파일 로드
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

export const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || '';
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || '';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH =
  process.env.NODE_ENV === 'production' ? process.env.AWS_S3_BUCKET_NAME! : 'public';
export const STATIC_PATH = 'static';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// CORS 설정 추가
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3001';

// AWS 설정 확인
if (IS_PRODUCTION) {
  const requiredEnvVars = [
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_S3_BUCKET_NAME',
    'DATABASE_URL',
    'JWT_ACCESS_TOKEN_SECRET',
    'JWT_REFRESH_TOKEN_SECRET',
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
      process.exit(1);
    }
  });
}
