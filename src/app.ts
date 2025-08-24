import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import notificationsRouter from './routers/notifications.route';
import { errorHandler } from './lib/errors/errorHandler'; // ⬅ 방금 만든 거 import
import { globalErrorHandler } from './controllers/errorController';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// 라우터 등록
app.use('/notifications', notificationsRouter);

// 에러 핸들러 등록 (항상 마지막)
app.use(globalErrorHandler);

export default app;
