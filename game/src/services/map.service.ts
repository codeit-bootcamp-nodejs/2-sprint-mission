import { db } from '../db';
import { maps } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function getMap(id: string) {
  const result = await db.select().from(maps).where(eq(maps.id, id));
  return result[0] || null;
}

export async function createMap(name: string, data: number[][]) {
  const [inserted] = await db.insert(maps).values({ name, data }).returning();
  return inserted;
}

export async function listMaps() {
  const result = await db.select().from(maps);
  return result;
}

export async function getDefaultMap() {
  const result = await db.select().from(maps).limit(1);
  return result[0] || null;
}

export async function getDefaultSpawnPoint() {
  const map = await getDefaultMap();
  if (!map) throw new Error('No default map found');

  const data: number[][] = map.data as any;

  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] === 2) {
        return { x, y };
      }
    }
  }

  return { x: 1, y: 1 };
}
