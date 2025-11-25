import express from 'express';
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
import { createServer } from 'http';
import { Server } from 'socket.io';
import notificationsRouter from './routers/notificationsRouter';
import { socketManager } from './lib/socketManager';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketManager.initialize(io);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.get('/api', (req, res) => {
  res.json({
    message: '판다마켓 API 서버입니다',
    version: '1.0.0',
    endpoints: {
      articles: '/articles',
      products: '/products',
      comments: '/comments',
      images: '/images',
      auth: '/auth',
      users: '/users',
      notifications: '/notifications',
    },
  });
});

app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/notifications', notificationsRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
