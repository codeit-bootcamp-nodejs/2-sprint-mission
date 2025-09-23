import type http from 'http';
import { Server, type Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server | null = null;

type JWTPayload = { id: number; [key: string]: unknown };

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: { origin: true, credentials: true },
    transports: ['websocket', 'polling'],
  });

  // 미들웨어: 인증 토큰 파싱
  io.use((socket: Socket, next: (err?: Error) => void) => {
    try {
      const bearer = socket.handshake.headers?.authorization as string | undefined;
      const token =
        (socket.handshake.auth as any)?.token ||
        (bearer && bearer.startsWith('Bearer ') ? bearer.slice(7) : undefined);

      if (token && process.env.JWT_SECRET) {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
        (socket.data as any).user = payload;
      }
      next();
    } catch {
      
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket.data as any)?.user as JWTPayload | undefined;
    if (user?.id) {
      socket.join(`user:${user.id}`);
    }
  });

  return io;
}

// Socket.IO 인스턴스를 반환하는 함수
export function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export function emitToUser(userId: number, event: string, payload: unknown) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
