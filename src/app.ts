import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import uploadRouter from './routes/upload.router';
import authRouter from './routes/auth.router';
import articleRouter from './routes/article.router';
import productRouter from './routes/product.router';
import commentRouter from './routes/comment.router';           
import userRouter from './routes/user.router';                 
import notificationRouter from './routes/notification.router'; 

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 

// 헬스체크
app.get('/health', (_req, res) => res.json({ ok: true }));

// 루트
app.get('/', (_req, res) => res.status(200).send({ message: 'Hello World!' }));

// 테스트가 기대하는 루트 경로에 직접 마운트
app.use('/auth', authRouter);
app.use('/articles', articleRouter);
app.use('/products', productRouter);

// 선택 라우터
app.use('/comments', commentRouter);
app.use('/users', userRouter);
app.use('/notifications', notificationRouter);

// 업로드 API 
app.use('/api', uploadRouter);

// 404 핸들러(라우터 뒤)
app.use((req, res) => res.status(404).json({ ok: false, message: 'Not Found' }));

// 공통 에러 핸들러
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ ok: false, message: err?.message ?? 'Server Error' });
  }
);

export default app;
