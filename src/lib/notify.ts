// src/lib/notify.ts
import type { Express } from 'express';

export function emitToUser(app: Express, userId: number, event: string, payload: any) {
    const io = app.get('io');
    if (!io) {
        console.warn('[notify] io is not set on app');
        return;
    }
    io.of('/notifications').to(`room:${userId}`).emit(event, payload);
}
