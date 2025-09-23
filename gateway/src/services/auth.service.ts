import { eq } from 'drizzle-orm';
import { db } from '../db';
import { comparePassword, hashPassword } from '../utils/password.util';
import { users } from '../db/schema';
import { Payload } from '../types/auth.type';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';

export async function signup(username: string, password: string) {
  const existingUser = await db.select().from(users).where(eq(users.username, username));
  if (existingUser.length > 0) {
    throw new Error('Username already exists');
  }

  const passwordHash = await hashPassword(password);
  const [inserted] = await db.insert(users).values({ username, password: passwordHash }).returning({ id: users.id });

  return { userId: inserted.id };
}

export const signin = async (username: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user) {
    const error: any = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const error: any = new Error('Invalid password');
    error.status = 401;
    throw error;
  }

  const payload: Payload = { id: user.id, username: user.username };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken) as Payload;
  const [user] = await db.select().from(users).where(eq(users.id, payload.id));
  if (!user) throw new Error('User not found');

  const newPayload: Payload = { id: user.id, username: user.username };
  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || null;
}
