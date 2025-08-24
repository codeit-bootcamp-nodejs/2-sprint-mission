// @ts-nocheck
// src/repositories/notifications.repository.ts
import { prisma } from '../lib/prismaClient';
import {
    Notification,
    NotificationType,
    NotificationEntityType,
} from '@prisma/client';

export interface ListParams {
    userId: number;
    page: number;   // 1-base
    limit: number;  // 1~50
}

export interface ListParams {
    userId: number;
    page: number;   // 1-base
    limit: number;  // 1~50
}

export async function listByUser({ userId, page, limit }: ListParams) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            // 필요하면 select로 최소 필드만
        }),
        prisma.notification.count({ where: { userId } }),
    ]);

    return { items, total };
}

export async function countUnread(userId: number) {
    const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
    });
    return { unreadCount };
}

export async function listByUser({ userId, page, limit }: ListParams) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            // 필요하면 select로 최소 필드만
        }),
        prisma.notification.count({ where: { userId } }),
    ]);

    return { items, total };
}

export async function countUnread(userId: number) {
    const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
    });
    return { unreadCount };
}

// 오너십 보장: 내 알림만 업데이트
export async function markAsRead(id: number, userId: number) {
    const updated = await prisma.notification.updateMany({
        where: { id, userId, isRead: false },
        data: { isRead: true },
    });
    // updated.count === 0 이면 내 것이 아니거나 이미 읽음
    return { updatedCount: updated.count };
}

export async function findManyByUser(params: ListParams) {
    const { items } = await listByUser(params);
    return items;
}

// 서비스: repo.countByUser({ userId })
export async function countByUser({ userId }: { userId: number }) {
    return prisma.notification.count({ where: { userId } });
}

export async function countUnreadByUser({ userId }: { userId: number }) {
    const { unreadCount } = await countUnread(userId);
    return unreadCount;
}

export async function findById(id: number) {
    return prisma.notification.findUnique({ where: { id } });
}

export async function updateIsRead(id: number, isRead: boolean) {
    return prisma.notification.update({
        where: { id },
        data: { isRead },
    });
}

export type CreateNotificationInput = {
    userId: number;
    type: NotificationType;               // 'NEW_COMMENT' | 'PRICE_CHANGE'
    title: string;
    message?: string | null;
    entityType: NotificationEntityType;   // 'ARTICLE' | 'PRODUCT'
    entityId: number;
    isRead?: boolean;                     // default false 권장
};

export async function create(input: CreateNotificationInput): Promise<Notification> {
    return prisma.notification.create({
        data: {
            userId: input.userId,
            type: input.type,
            title: input.title,
            message: input.message ?? null,
            entityType: input.entityType,
            entityId: input.entityId,
            isRead: input.isRead ?? false,
        },
    });
}