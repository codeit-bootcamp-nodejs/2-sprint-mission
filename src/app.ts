import express from 'express';
import cors from 'cors';

import uploadRouter from './routes/upload.router';

const app = express();

app.use(cors());
app.use(express.json());

// 헬스체크
app.get('/health', (_req, res) => res.json({ ok: true }));

// 루트
app.get('/', (_, res) => res.status(200).send({ message: 'Hello World!' }));

// 업로드 API
app.use('/api', uploadRouter);


// 공통 에러 핸들러
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ ok: false, message: err?.message ?? 'Server Error' });
  }
);

export default app;
