 // src/app.js
 import express from 'express';
 import dotenv from 'dotenv';

 // 각종 라우터 import
 import userRouter     from './routers/usersRouter.js';
 import productsRouter from './routers/productsRouter.js';
 import articlesRouter from './routers/articleRouter.js';
import errorHandler from './controllers/errorController.js';
import { defaultNotFoundHandler } from './controllers/errorController.js';


 dotenv.config();

 const app = express();

 // 1) 전역 미들웨어 세팅
 app.use(express.json());       


 // 2) 라우터 연결
 app.use('/users',    userRouter);
 app.use('/products', productsRouter);
 app.use('/articles', articlesRouter);
app.use(defaultNotFoundHandler);
app.use(errorHandler);


 export default app;
