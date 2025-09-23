import { Server, Socket } from 'socket.io';
import NotificationService from './service/notification/notification-service';
import cookieParser from 'cookie-parser';
import passport from 'passport';

cookieParser();
passport.initialize();

const notificationService = new NotificationService();

export const socket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('user connected');

    // 로그인
    socket.on('login', (data: {userId: number}) => {
      socket.data.user = data.userId;
      socket.join(data.userId.toString());
      socket.emit('message', {message: '로그인 성공'});
      console.log(`user: ${socket.data.user}`);
    });
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

export default { socket };