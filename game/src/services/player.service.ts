import { db } from '../db';
import { players } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export async function createPlayer(id: string, username: string, x: number, y: number, dir: number, color: string) {
  await db.insert(players).values({
    id,
    x,
    y,
    dir,
    color,
    username,
    updatedAt: new Date(),
  });
}

export async function movePlayer(id: string, x: number, y: number, dir: number) {
  await db.update(players).set({ x, y, dir, updatedAt: new Date() }).where(eq(players.id, id));
}

export async function getNearbyPlayerList(id: string, radius: number) {
  const [me] = await db.select().from(players).where(eq(players.id, id));

  if (!me) return [];

  const result = await db.execute(
    sql`SELECT id, username, x, y, dir, color
         FROM players
         WHERE id != ${me.id}
           AND power(x - ${me.x}, 2) + power(y - ${me.y}, 2) <= ${radius * radius}`
  );

  return result.rows;
}

export async function removePlayer(id: string) {
  await db.delete(players).where(eq(players.id, id));
}
