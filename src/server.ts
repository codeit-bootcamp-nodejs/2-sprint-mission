// src/server.ts
import http from 'http';
import { Server } from 'socket.io';
import app from './app';

// 1) HTTP 서버 생성
const PORT = Number(process.env.PORT) || 3000;
const server = http.createServer(app);

// 2) Socket.IO 서버 생성
const io = new Server(server, {
    cors: {
        origin: '*', // 필요시 프론트 주소로 제한
        credentials: true,
    },
});

// 3) 네임스페이스: /notifications
const nsp = io.of('/notifications');

// 🔐 최소 인증/식별 (임시): userId를 핸드셰이크에서 추출
function getUserIdFromSocket(socket: any): number | null {
    // ✅ 우선순위: auth.userId → query.userId
    const raw =
        socket.handshake?.auth?.userId ??
        socket.handshake?.query?.userId;

    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// 4) 연결 이벤트
nsp.on('connection', (socket) => {
    const userId = getUserIdFromSocket(socket);
    if (!userId) {
        socket.disconnect(true);
        return;
    }

    const roomName = `room:${userId}`;
    socket.join(roomName);
    console.log(`[socket] /notifications connected userId=${userId} → joined ${roomName}`);

    // 간단한 핑/퐁 확인
    socket.on('notification:ping', () => {
        socket.emit('notification:pong', { t: Date.now() });
    });

    socket.on('disconnect', (reason) => {
        console.log(`[socket] userId=${userId} disconnected: ${reason}`);
    });
});

// 5) app에서 io 접근 가능하게 공유
app.set('io', io);

// 6) 서버 리슨
server.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
});
