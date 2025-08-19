import db from "../config/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

type JwtPayload = { sub: string | number; iat: number; exp: number };

// 초기화
export let io: Server;

export const sockets = (server: HttpServer) => {
  io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
    allowRequest(req, fn) {
      fn(null, true);
    },
  });

  const namespace = io.of("/notifications");

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
      (socket.data as any).userId = userId;
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

    // 접속 즉시 현재 미읽음 카운트 push
    const unreadCount = await getUnreadCount(userId);
    socket.emit("notifications:unread-count", { count: unreadCount });

    socket.on("disconnect", () => {
      socket.leave(room);
    });
  });
};

async function getUnreadCount(userId: number) {
  return db.notifications.count({ where: { userId, isRead: false } });
}

// 외부에서 사용할 emitter
export function emitNotification(userId: number, payload: any) {
  if (!io) return;
  io.of("/notifications")
    .to(`user:${userId}`)
    .emit("notifications:new", payload);

  // if (!io) return;
  // const nsp = io.of("/notifications");
  // const room = `user:${userId}`;
  // console.log("[emit] notifications:new ->", { userId, room, payload });
  // nsp.to(room).emit("notifications:new", payload);
}

export async function emitUnreadCount(userId: number) {
  if (!io) return;
  const count = await db.notifications.count({
    where: { userId, isRead: false },
  });
  io.of("/notifications")
    .to(`user:${userId}`)
    .emit("notifications:unread-count", { count });

  // if (!io) return;
  // const count = await db.notifications.count({
  //   where: { userId, isRead: false },
  // });
  // const nsp = io.of("/notifications");
  // const room = `user:${userId}`;
  // console.log("[emit] unread-count ->", { userId, room, count });
  // nsp.to(room).emit("notifications:unread-count", { count });
}
