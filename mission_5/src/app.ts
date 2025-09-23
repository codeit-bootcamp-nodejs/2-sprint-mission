import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { notFoundErrorHandeler, errorHandler } from './utills/errorHandler'
import passport from 'passport';
import { articleRoute } from './controller/article-controller';
import ProductController from './controller/product-controller';
import FileController from './controller/file-controller';
import userController from './controller/user-controller';

const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'https://three-sprint-mission-4goe.onrender.com'],
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use('/article', articleRoute);
app.use('/product', ProductController);
app.use('/file', FileController);
app.use('/user', userController);
app.use(notFoundErrorHandeler);
app.use(errorHandler)
app.use('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));