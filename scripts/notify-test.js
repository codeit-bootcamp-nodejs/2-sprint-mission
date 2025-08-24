// scripts/notify-test.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000/notifications", {
    // transports 옵션 제거! (기본: polling -> websocket 업그레이드)
    auth: { userId: 1 },
    reconnectionAttempts: 1,   // 실패 시 1번만 재시도(로그 보기 좋게)
    timeout: 5000,
});

socket.on("connect", () => {
    console.log("connected:", socket.id);
    socket.emit("notification:ping");
});

socket.on("notification:pong", (data) => {
    console.log("pong:", data);
    socket.close();
    process.exit(0);
});

socket.on("connect_error", (err) => {
    console.error("connect_error:", err.message);
    if (err?.data) console.error("connect_error data:", err.data);
});

socket.on("error", (e) => {
    console.error("error:", e);
});

socket.on("disconnect", (reason) => {
    console.log("disconnected:", reason);
});
