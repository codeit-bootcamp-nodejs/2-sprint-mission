import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: varchar('sender_id', { length: 255 }).notNull(),
  scope: varchar('scope', { length: 20 }).notNull(), // "global" | "local"
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
