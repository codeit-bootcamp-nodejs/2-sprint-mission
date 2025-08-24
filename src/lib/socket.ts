// src/lib/socket.ts
import { Server } from 'socket.io';

export function mountSocket(httpServer: any) {
    const io = new Server(httpServer, { path: '/ws', cors: { origin: '*' } });

    const nsp = io.of('/notifications');
    nsp.on('connection', (socket) => {
        // 예: 핸드셋/쿠키/토큰에서 userId 파싱(프로젝트 인증 로직에 맞춰 교체)
        const userId = Number(socket.handshake.auth?.userId);
        if (!userId) return socket.disconnect();

        socket.join(`room:${userId}`);
        socket.on('notification:ping', () => socket.emit('notification:pong', Date.now()));
    });

    return io;
}
