import dotenv from 'dotenv';
dotenv.config({path:'../.env'});

// BASIC
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

// ENCRYPT_KEY
const ENCRYPT_KEY = process.env.ENCRYPT_KEY!;

// TOKEN
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET!;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!;

// AUTH0
const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_SECRET = process.env.AUTH0_SECRET;
const AUTH0_BASE_URL = process.env.AUTH0_BASE_URL;

// NAVER
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

// DISCORD
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;

const BASE_URL = process.env.BASE_URL!;

export {
    NODE_ENV,
    PORT,

    ENCRYPT_KEY,
    BASE_URL,

    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,

    AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID,
    AUTH0_SECRET,
    AUTH0_BASE_URL,

    NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET,

    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET

};