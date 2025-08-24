// scripts/socket-mini.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// ✅ /notifications 네임스페이스 (이름 바꿔 중복 방지)
const notificationsNsp = io.of('/notifications');

// 간단 인증: auth.userId 또는 query.userId
notificationsNsp.use((socket, next) => {
    const uid = Number(socket.handshake.auth?.userId ?? socket.handshake.query?.userId);
    if (!Number.isFinite(uid) || uid <= 0) return next(new Error('unauthorized'));
    socket.data.userId = uid;
    socket.join(`user:${uid}`);
    next();
});

// 연결 로그 / ping-pong
notificationsNsp.on('connection', (s) => {
    console.log('[mini] /notifications connected uid=', s.data.userId, 'sid=', s.id);
    s.on('notification:ping', () => s.emit('notification:pong', { t: Date.now() }));
});

// ✅ 테스트용 emit (POST /dev/emit)
app.post('/dev/emit', async (req, res) => {
    const { userId, event = 'notification:new', data = { title: '테스트', type: 'SYSTEM' } } = req.body || {};
    const uid = Number(userId);
    if (!Number.isFinite(uid) || uid <= 0) {
        return res.status(400).json({ message: 'userId must be a positive number' });
    }
    const room = `user:${uid}`;
    const sockets = await notificationsNsp.in(room).allSockets(); // 방에 붙어있는 소켓 수(검증용)
    notificationsNsp.to(room).emit(event, data);                  // 실제 전송
    return res.json({ ok: true, room, event, connected: sockets.size, preview: data });
});

server.listen(4000, () => {
    console.log('[mini] Server + Socket.IO on 4000');
});
