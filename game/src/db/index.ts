import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config/config';

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
});

export const db = drizzle(pool);
