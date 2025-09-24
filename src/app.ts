import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


import usersRouter from './routes/user-route';
import productRouter from './routes/product-route';
import articleRouter from './routes/article-route';
import commentRouter from './routes/comment-route';
import imageRouter from './routes/image-route';
import notificationRouter from './routes/notification-route';


const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// 업로드 한 파일 보기
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// route 사용
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/article', articleRouter);
app.use('/comment', commentRouter);
app.use('/image', imageRouter);
app.use('/me', notificationRouter);

// health 체크

app.get('/health', (req, res) =>{
  res.json({message : 'ok'})
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler

app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

export default app;




