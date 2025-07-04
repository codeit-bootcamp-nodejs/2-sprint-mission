import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import passport from 'passport';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.ts'
import mypageRoutes from './routes/mypage.route.ts';
import productRoutes from './routes/product.route.ts';
import articleRoutes from './routes/article.route.ts';
import commentRoutes from './routes/comment.route.ts';
import errorHandler from './middlewares/error.middleware.ts';


import { PORT } from './lib/constants.ts';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // passport 초기화

// 라우터 연결
app.use('/auth', authRoutes);
app.use('/mypage', mypageRoutes);
app.use('/product', productRoutes);
app.use('/article', articleRoutes);
app.use('/', commentRoutes);

// 파일 정적 서빙
app.use('/product/files', express.static('uploads'));

// 에러 핸들러
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 서버 실행중: http://localhost:${PORT}`);
});

export default app;
