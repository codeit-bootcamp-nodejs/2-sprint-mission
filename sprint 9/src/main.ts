// src/main.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

import NotificationRepository from './notification/repository';
import NotificationService from './notification/service';
import makeNotificationRouter from './notification/router';
import ProductService from './product/service';
import makeProductRouter from './product/router';
import ArticleService from './articles/service';
import makeArticleRouter from './articles/router';

export const app = express();
app.use(express.json());
app.use(express.static('public'));

export const prisma = new PrismaClient();

// ─ 테스트 환경에서만 요청마다 user 주입 ─
if (process.env.NODE_ENV === 'test') {
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
}

// ─ Socket.IO ─
export const server = createServer(app);
export const io = new Server(server, { cors: { origin: '*' } });

// 테스트 환경에서만 socket.userId 주입
io.use(async (socket, next) => {
  try {
    if (process.env.NODE_ENV !== 'test') return next();
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
  const userId = (socket as any).userId as number | undefined;
  if (userId) socket.join(`user:${userId}`);
});

// ─ DI ─
const notifSvc = new NotificationService(new NotificationRepository(prisma), io);
app.use('/notifications', makeNotificationRouter(notifSvc));

const productSvc = new ProductService(prisma, notifSvc);
app.use('/products', makeProductRouter(productSvc));

const articleSvc = new ArticleService(prisma, notifSvc);
app.use('/articles', makeArticleRouter(articleSvc));

app.get('/', (_req, res) => res.send('OK'));

// ─ 404 & 에러 핸들러 (라우터 뒤!) ─
app.use((_req, res) => res.status(404).json({ message: 'Not Found' }));
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status ?? 500;
    const message = err.message ?? 'Internal Server Error';
    res.status(status).json({ message });
  }
);

// ─ 실행/정리 함수 ─
export function start(port = Number(process.env.PORT) || 3000) {
  return new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(`Server running on ${port}`);
      resolve();
    });
  });
}

export async function stop() {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
}

// 파일을 직접 실행할 때만 서버 시작 (Jest import 시 자동 실행 방지)
if (require.main === module) {
  start();
  const graceful = async () => {
    await stop();
    process.exit(0);
  };
  process.on('SIGINT', graceful);
  process.on('SIGTERM', graceful);
}
