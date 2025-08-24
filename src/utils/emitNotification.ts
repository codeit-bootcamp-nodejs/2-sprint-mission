import type { Request } from 'express';
import type { Namespace } from 'socket.io';

export function emitNotification(req: Request, userId: number, data: any, event = 'notification:new') {
    const nsp = req.app.get('nsp:notifications') as Namespace | undefined;
    if (!nsp) return;
    nsp.to(`user:${userId}`).emit(event, data);
}
