// src/main.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

import NotificationRepository from './notification/repository';
import NotificationService from './notification/service';
import makeNotificationRouter from './notification/router';

// ➕ 트리거 라우터 추가
import ProductService from './product/service';
import makeProductRouter from './product/router';
import ArticleService from './articles/service';
import makeArticleRouter from './articles/router';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const prisma = new PrismaClient();

// 임시 인증(테스트용): DB에 유저 없으면 생성 후 req.user 주입
app.use(async (req, _res, next) => {
  try {
    const found = await prisma.user.findFirst({ select: { id: true } });
    const user =
      found ??
      (await prisma.user.create({
        data: { email: 'test@example.com', nickname: 'test', password: 'test' },
        select: { id: true },
      }));
    (req as any).user = { id: user.id };
    next();
  } catch (e) {
    next(e);
  }
});

// ── Socket.IO ────────────────────────────────────────────────
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// 소켓 인증(테스트용): DB 유저 보장 후 user:{id} 룸에 합류
io.use(async (socket, next) => {
  try {
    const found = await prisma.user.findFirst({ select: { id: true } });
    const user =
      found ??
      (await prisma.user.create({
        data: { email: 'test@example.com', nickname: 'test', password: 'test' },
        select: { id: true },
      }));
    (socket as any).userId = user.id;
    next();
  } catch (e) {
    next(e as Error);
  }
});

io.on('connection', (socket) => {
  const userId = (socket as any).userId as number;
  socket.join(`user:${userId}`);
});

// ── DI ───────────────────────────────────────────────────────
const notifSvc = new NotificationService(new NotificationRepository(prisma), io);

// 알림 라우터
app.use('/notifications', makeNotificationRouter(notifSvc));

// ➕ 상품/게시글 라우터 (가격변동/댓글 트리거)
const productSvc = new ProductService(prisma, notifSvc);
app.use('/products', makeProductRouter(productSvc));

const articleSvc = new ArticleService(prisma, notifSvc);
app.use('/articles', makeArticleRouter(articleSvc));

app.get('/', (_req, res) => res.send('OK'));

// ── 서버 시작/종료 ────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

const graceful = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};
process.on('SIGINT', graceful);
process.on('SIGTERM', graceful);
