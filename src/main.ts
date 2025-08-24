import http from 'http';
import { Server } from 'socket.io';
import express, { RequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants';
import articlesRouter from './routers/articlesRouter';
import productsRouter from './routers/productsRouter';
import commentsRouter from './routers/commentsRouter';
import imagesRouter from './routers/imagesRouter';
import authRouter from './routers/authRouter';
import usersRouter from './routers/usersRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';
import notificationsRouter from "./routers/notifications.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));
app.use((req, _res, next) => {
  const uid = Number((req as any).cookies?.userId);
  if (Number.isFinite(uid) && uid > 0) {
    //테스트 용 
    (req as any).user = { id: uid };
  }
  next();
});

app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use("/notifications", notificationsRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// --- SOCKET: /notifications ---
const nsp = io.of('/notifications');
app.set('nsp:notifications', nsp);

// 인증 미들웨어
nsp.use((socket, next) => {
  const authUidRaw = socket.handshake.auth?.userId ?? socket.handshake.query?.userId;
  const authUid = Number(authUidRaw);

  const cookieHeader = (socket.request as any)?.headers?.cookie || '';
  const m = /(?:^|;\s*)userId=(\d+)/.exec(cookieHeader);
  const cookieUid = m ? Number(m[1]) : NaN;

  const uid =
    Number.isFinite(authUid) && authUid > 0 ? authUid :
      Number.isFinite(cookieUid) && cookieUid > 0 ? cookieUid :
        NaN;

  if (!Number.isFinite(uid)) return next(new Error('unauthorized'));
  (socket as any).data.userId = uid;
  socket.join(`user:${uid}`);
  next();
});

// 연결 이벤트 (ping/pong)
nsp.on('connection', (socket) => {
  console.log('[socket] uid =', (socket as any).data.userId, 'sid =', socket.id);
  socket.on('notification:ping', () => socket.emit('notification:pong', { t: Date.now() }));
});

// 테스트용 emit 라우트  ※ 에러핸들러보다 "위"
const devEmit: RequestHandler = async (req, res) => {
  const body: any = req.body ?? {};
  const uid = Number(body.userId);
  const event = body.event ?? 'notification:new';
  const data = body.data ?? { title: '테스트', type: 'SYSTEM' };

  if (!Number.isFinite(uid) || uid <= 0) {
    res.status(400).json({ message: 'userId must be a positive number' });
    return;
  }

  const room = `user:${uid}`;
  const sockets = await nsp.in(room).allSockets();
  nsp.to(room).emit(event, data);

  res.json({ ok: true, room, event, connected: sockets.size, preview: data });
};
app.post('/dev/emit', devEmit);

// 에러 핸들러 (최하단 직전, 한 번만)
app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

// 마지막: 서버 시작
server.listen(PORT, () => {
  console.log(`Server + Socket.IO on ${PORT}`);
});


