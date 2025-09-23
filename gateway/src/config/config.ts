import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config = {
  app: {
    port: Number(requireEnv('PORT', '3000')),
    env: requireEnv('NODE_ENV', 'development'),
  },
  external: {
    gateway: requireEnv('GATEWAY_SERVICE_URL', 'http://gateway:3000'),
    chat: requireEnv('CHAT_SERVICE_URL', 'http://chat:3001'),
    game: requireEnv('GAME_SERVICE_URL', 'http://game:3002'),
    client: requireEnv('CLIENT_SERVICE_URL', 'https://www.messagoom.online'),
  },
  db: {
    host: requireEnv('DB_HOST', 'db'),
    port: Number(requireEnv('DB_PORT', '5432')),
    user: requireEnv('DB_USER', 'postgres'),
    password: requireEnv('DB_PASSWORD', 'postgres'),
    name: requireEnv('DB_NAME', 'sample-game'),
  },
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiration: requireEnv('JWT_ACCESS_EXPIRATION', '15m') as jwt.SignOptions['expiresIn'],
    refreshExpiration: requireEnv('JWT_REFRESH_EXPIRATION', '7d') as jwt.SignOptions['expiresIn'],
  },
};
