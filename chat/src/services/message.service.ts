import { db } from '../db/index';
import { messages } from '../db/schema';
import { eq, and, gte, lte, asc, desc } from 'drizzle-orm';
import { SaveMessageRequest, GetMessageListRequest } from '../types/message.type';

export async function saveMessage(data: SaveMessageRequest): Promise<void> {
  await db.insert(messages).values({
    senderId: data.senderId,
    scope: data.scope,
    message: data.message,
  });
}

export async function getMessageList(params: GetMessageListRequest) {
  const { limit = 50, offset = 0, scope, senderId, from, to, order = 'asc' } = params;

  const conditions = [];

  if (scope) conditions.push(eq(messages.scope, scope));
  if (senderId) conditions.push(eq(messages.senderId, senderId));
  if (from) conditions.push(gte(messages.createdAt, from));
  if (to) conditions.push(lte(messages.createdAt, to));

  return await db
    .select()
    .from(messages)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(order === 'asc' ? asc(messages.createdAt) : desc(messages.createdAt))
    .limit(limit)
    .offset(offset);
}
