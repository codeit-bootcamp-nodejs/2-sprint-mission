import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'access-token';
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh-token';
const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refresh-token';
const AWS_REGION = process.env.AWS_REGION || 'aws-region';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'aws-access-key';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'aws-secret-key';
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'aws-s3-bucket';


export {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
  AWS_REGION, AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET
};