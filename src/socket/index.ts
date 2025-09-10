import { Server } from "socket.io";
import { verifyAccessToken } from "../lib/token";

let io: Server;

export function connectSocket(server: any) {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "PATCH"] },
  });

  // JWT 토큰 인증
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("권한 없음"));

    try {
      const { userId } = verifyAccessToken(token);
      socket.data.userId = userId;
      next();
    } catch (err) {
      next(new Error("권한 없음"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    const userId = socket.data.userId;
    if (userId) socket.join(`user_${userId}`); // 유저별 room생성 

    // 연결 종료 이벤트
    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
}

// 다른 파일에서 io를 가져다 쓸 수 있도록
export function getIO() {
  if (!io) throw new Error("Socket.IO 서버가 아직 초기화되지 않았습니다.");
  return io;
}
