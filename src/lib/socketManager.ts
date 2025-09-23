import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from './token';

class SocketManager {
  private io: Server | null = null;
  private userSockets: Map<number, string> = new Map();

  initialize(io: Server) {
    this.io = io;

    io.on('connection', (socket: Socket) => {
      socket.on('authenticate', async (token: string) => {
        try {
          const { userId } = verifyAccessToken(token);
          this.userSockets.set(userId, socket.id);
          socket.join(`user-${userId}`);
          socket.emit('authenticated', { userId });
        } catch (error) {
          socket.emit('auth-error', 'Invalid token');
        }
      });

      socket.on('disconnect', () => {
        for (const [userId, socketId] of this.userSockets.entries()) {
          if (socketId === socket.id) {
            this.userSockets.delete(userId);
            break;
          }
        }
      });
    });
  }

  sendNotification(userId: number, notification: any) {
    if (this.io) {
      this.io.to(`user-${userId}`).emit('notification', notification);
    }
  }
}

export const socketManager = new SocketManager();
