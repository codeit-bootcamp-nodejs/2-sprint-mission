import dotenv from "dotenv";
dotenv.config();
import { io, Socket } from "socket.io-client";

const SOCKET_PATH = process.env.SOCKET_PATH || "/socket.io";

const token = "..";
const socket: Socket = io("http://localhost:4000", {
  path: SOCKET_PATH,
  transports: ["websocket"],
  withCredentials: true,
  extraHeaders: { Cookie: `access-token=${token}` },
});

console.log("🔌 creating socket ...");

socket.on("connect", () => {
  console.log("✅ 연결 성공:", socket.id);
});

socket.on("connect_error", (err: any) => {
  console.error("❌ connect_error:", err?.message || err);
});

socket.on("error", (err: any) => {
  console.error("❌ error:", err);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ disconnect:", reason);
});

// 서버 → 클라 알림
socket.on("notifications:new", (payload) => {
  console.log("🔔 새 알림:", payload);
});

socket.on("notifications:unread-count", ({ count }) => {
  console.log("📊 미읽음:", count);
});
