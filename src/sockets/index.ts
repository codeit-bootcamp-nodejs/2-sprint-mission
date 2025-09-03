import db from "../config/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

import { JwtPayload } from "../utils/dtos/socket.dto";

// 초기화
export let io: Server;

export const sockets = (server: HttpServer) => {
  io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const namespace = io.of("/notify");

  // 핸드셰이크 인증 미들웨어
  namespace.use((socket, next) => {
    try {
      // 쿠키 파싱
      const rawCookie = socket.handshake.headers.cookie || "";
      const parsed = cookie.parse(rawCookie);
      const token = parsed[process.env.ACCESS_TOKEN_COOKIE_NAME!];

      if (!token) return next(new Error("No access token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const userId = Number(decoded.sub);
      if (!userId) return next(new Error("Invalid JWT payload"));

      // 이후 소켓 컨텍스트에 저장
      socket.data.userId = userId;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  // 연결 처리
  namespace.on("connection", async (socket) => {
    const userId = Number(socket.data.userId);
    const room = `user:${userId}`;

    socket.join(room);

    // 로그인 후, 읽지 않은 알림 카운트 푸시
    const unreadCount = await getUnreadCount(userId);
    socket.emit("notify:unread-count", { count: unreadCount });

    socket.on("disconnect", () => {
      socket.leave(room);
    });
  });
};

async function getUnreadCount(userId: number) {
  return db.notify.count({ where: { userId, isRead: false } });
}

// 외부에서 사용할 emitter
export function emitNotification(userId: number, payload: any) {
  // if (!io) return;
  // io.of("/notify").to(`user:${userId}`).emit("notify:new", payload);

  // 디버깅용
  if (!io) return;
  const nsp = io.of("/notify");
  const room = `user:${userId}`;
  console.log("[emit] notify:new ->", { userId, room, payload });
  nsp.to(room).emit("notify:new", payload);
}

export async function emitUnreadCount(userId: number) {
  // if (!io) return;
  // const count = await db.notify.count({
  //   where: { userId, isRead: false },
  // });
  // io.of("/notify").to(`user:${userId}`).emit("notify:unread-count", { count });

  // 디버깅용
  if (!io) return;
  const count = await db.notify.count({
    where: { userId, isRead: false },
  });
  const nsp = io.of("/notify");
  const room = `user:${userId}`;
  console.log("[emit] unread-count ->", { userId, room, count });
  nsp.to(room).emit("notify:unread-count", { count });
}
