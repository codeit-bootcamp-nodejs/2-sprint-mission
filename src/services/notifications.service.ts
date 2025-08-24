// src/services/notificationsService.ts
import * as repo from '../repositories/notificationsRepository';
import { Notification } from '@prisma/client';

/** 목록 조회: page/limit 보정 + total 함께 반환 */
export async function list(params: { userId: number; page?: number; limit?: number }) {
    const userId = params.userId;
    let page = params.page ?? 1;
    let limit = params.limit ?? 20;

    // 방어적 보정
    if (page < 1) page = 1;
    if (limit < 1) limit = 20;
    if (limit > 50) limit = 50;

    const items = await repo.findManyByUser({ userId, page, limit });
    const total = await repo.countByUser({ userId });

    return { items, page, limit, total };
}

/** 미읽음 개수 */
export async function unreadCount({ userId }: { userId: number }) {
    const unreadCount = await repo.countUnreadByUser({ userId });
    return { unreadCount };
}

/** 단건 읽음 처리: 오너십(내 알림) 확인 후 isRead=true */
export async function readOne({ id, userId }: { id: number; userId: number }) {
    const n = await repo.findById(id);
    if (!n) {
        // 컨트롤러에서 404 변환
        throw new Error('404_NOT_FOUND');
    }
    if (n.userId !== userId) {
        // 컨트롤러에서 403 변환
        throw new Error('403_FORBIDDEN');
    }
    if (!n.isRead) {
        await repo.updateIsRead(id, true);
    }
    return { id, isRead: true };
}

/**
 * (옵션) 트리거 헬퍼: DB insert 후 실시간 emit
 * io: Socket.IO 서버 인스턴스(app.get('io') 등에서 주입)
 */
export async function createAndEmit(
    io: any,
    payload: {
        userId: number;
        type: 'NEW_COMMENT' | 'PRICE_CHANGE';
        title: string;
        message?: string | null;
        entityType: 'ARTICLE' | 'PRODUCT';
        entityId: number;
    }
): Promise<Notification> {
    // 1) DB 기록(단일 진실)
    const saved = await repo.create({
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message ?? null,
        entityType: payload.entityType,
        entityId: payload.entityId,
        isRead: false,
    });

    // 2) 실시간 emit (네임스페이스/룸 규칙: /notifications + room:<userId>)
    io.of('/notifications').to(`room:${payload.userId}`).emit('notification:new', {
        id: saved.id,
        userId: saved.userId,
        type: saved.type,
        title: saved.title,
        message: saved.message,
        entityType: saved.entityType,
        entityId: saved.entityId,
        isRead: saved.isRead,
        createdAt: saved.createdAt, // 프론트에서 toISOString 필요시 거기서 처리
    });

    return saved;
}

