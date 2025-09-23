import { Server } from "socket.io";
import http from "http";

export let io: Server;

export const initSocket = (server: http.Server) => {
  /*
    쿠키, 세션, 인증헤더 사용 시 credentials: true 추가
    예시: cors: {
      origin: "*",
      methods: ["GET", "POST"]
      credentials: true
    }
    주의: origin에 "*" 와일드 카드 사용 불가 => 실제 도메인으로 변경
  */
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("서버 연결 완료", socket.id);

    socket.on("message", (data) => {
      io.emit("message", data); // 모든 클라이언트에게 메시지 전송
    });

    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
      socket.emit("join", userId);
      console.log(`user_${userId} 방에 입장`);
    });

    socket.on("disconnect", () => {
      console.log("서버 연결 종료", socket.id);
    });
  });
};

export const sendNotification = (userId: number, notification: any) => {
  if (io) io.to(`user_${userId}`).emit("notification", notification);
}