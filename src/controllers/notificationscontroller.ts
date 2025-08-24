// src/controllers/notificationsController.ts
import { Request, Response } from 'express';
import { validate } from '../lib/validate';
import { assertHasUser } from '../utils/assertHasUser';
import * as notificationsService from '../services/notifications.service';

import { object, optional, number, type Struct } from 'superstruct';

type PageLimit = { page?: number; limit?: number };

const PageLimitStruct: Struct<PageLimit> = object({
    page: optional(number()),
    limit: optional(number()),
});

// GET /notifications
export async function getMyNotifications(req: Request, res: Response) {
    assertHasUser(req);

    // ⬇️ 제네릭으로 기대 타입을 알려줘서 unknown → PageLimit
    const { page, limit } = validate<PageLimit>(req.query, PageLimitStruct);

    const result = await notificationsService.list({
        userId: req.user.id,
        page,
        limit,
    });
    res.status(200).json(result);
}

// GET /notifications/unread-count
export async function getUnreadCount(req: Request, res: Response) {
    assertHasUser(req);
    const result = await notificationsService.unreadCount({ userId: req.user.id });
    res.status(200).json(result); // { unreadCount: number }
}

// PATCH /notifications/:id/read
export async function readMyNotification(req: Request, res: Response) {
    assertHasUser(req);
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'INVALID_ID' });
    }

    try {
        const result = await notificationsService.readOne({ id, userId: req.user.id });
        res.status(200).json(result); // { id, isRead: true }
    } catch (e: any) {
        if (e?.message === '404_NOT_FOUND') return res.status(404).json({ message: 'NOTIFICATION_NOT_FOUND' });
        if (e?.message === '403_FORBIDDEN') return res.status(403).json({ message: 'FORBIDDEN' });
        console.error('[notifications.read] error:', e);
        res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
}
