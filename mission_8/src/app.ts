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
import {Server} from 'socket.io';
import http from 'http';
import { socket } from './socket';
import notificationController from './controller/notification-controller';

const corsOptions = {
  origin: ['localhost:3000'],
};

const app = express();

app.use(cors(corsOptions) || { origin: "*" });
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use('/article', articleRoute);
app.use('/product', ProductController);
app.use('/file', FileController);
app.use('/user', userController);
app.use('/notification', notificationController);
app.use(notFoundErrorHandeler);
app.use(errorHandler)
app.use('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

// 웹소켓
const server = http.createServer(app);
export const io = new Server(server, {
  cors: corsOptions || { origin: "*" },
});
socket(io);

server.listen(process.env.PORT || 3000, () => console.log(`Server Started on ${process.env.PORT || 3000}`));
