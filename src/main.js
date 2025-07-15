import express from 'express';
import cors from 'cors';
import path from 'path';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants.js';
import articlesRouter from './routers/articlesRouter.js';
import productsRouter from './routers/productsRouter.js';
import commentsRouter from './routers/commentsRouter.js';
import imagesRouter from './routers/imagesRouter.js';
import usersRouter from './routers/usersRouter.js';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController.js';

const app = express();
//미들웨어 : 먼저 시작하는 미들 웨어
app.use(cors());
app.use(express.json());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

//라우트 : 경로가 정확 할 때 보통 씀 / if문
app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/users', usersRouter);

//매인 라우트 :  미들웨어 /라우터가 시작하고 난 후 시행 되는 미들웨어 
app.use(defaultNotFoundHandler); //404로 변환 한다 라우트에 대한 예외 상황을 처리 
app.use(globalErrorHandler); //가장 마지막에 씀 라우트에서 발생한 에러를 처리 함 


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
