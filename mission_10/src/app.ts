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
  origin: ['http://localhost:3000', 'http://localhost:3001'],
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
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: "welcome to sooyen server!" });
});
app.use(notFoundErrorHandeler);
app.use(errorHandler);

// 웹소켓
const server = http.createServer(app);
export const io = new Server(server, {
  cors: corsOptions || { origin: "*" },
});
socket(io);

const port = process.env.NODE_ENV === 'test' ? 0 : (process.env.PORT || 3000);
server.listen(port, () => console.log(`Server Started on ${port}`));

export default app;