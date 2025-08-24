// src/services/notificationsService.ts
import * as repo from '../repositories/notificationsRepository';

export async function list({ userId, page, limit }: {
  userId: number; page: number; limit: number;
}) {
  const [items, total] = await Promise.all([
    repo.findManyByUser({ userId, page, limit }),
    repo.countByUser({ userId })
  ]);
  return { items, page, limit, total };
}

export async function unreadCount({ userId }: { userId: number }) {
  return repo.countUnreadByUser({ userId });
}

export async function readOne({ id, userId }: { id: number; userId: number }) {
  const n = await repo.findById(id);
  if (!n) throw new Error('404_NOT_FOUND');
  if (n.userId !== userId) throw new Error('403_FORBIDDEN');
  if (!n.isRead) await repo.updateIsRead(id, true);
  return { id, isRead: true };
}

// 트리거용 헬퍼(댓글/가격변동에서 사용)
export async function createAndEmit(io: any, payload: {
  userId: number; type: 'NEW_COMMENT' | 'PRICE_CHANGE';
  title: string; message?: string;
  entityType: 'ARTICLE' | 'PRODUCT'; entityId: number;
}) {
  const saved = await repo.create(payload);
  io.of('/notifications').to(`room:${payload.userId}`)
    .emit('notification:new', saved);
  return saved;
}
