import express from 'express';
import { Request, Response } from 'express';

// 1. app 객체 생성
export const app = express();

// 2. 미들웨어 설정 (예시)
app.use(express.json());

// 3. 라우터 설정 (예시)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// 4. 서버 리스닝
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});