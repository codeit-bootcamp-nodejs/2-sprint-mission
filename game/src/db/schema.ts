import { pgTable, uuid, integer, timestamp, text, jsonb, doublePrecision } from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull(),
  x: doublePrecision('x').notNull().default(0),
  y: doublePrecision('y').notNull().default(0),
  dir: doublePrecision('dir').notNull().default(0),
  color: text('color').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const maps = pgTable('maps', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
