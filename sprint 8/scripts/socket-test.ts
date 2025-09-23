import { io } from "socket.io-client";
const s = io("http://localhost:3000", { auth: { userId: 1 } });
s.on("connect", () => console.log("connected:", s.id));
s.on("connect_error", (e) => console.error("connect_error:", e.message));
s.on("notification:new", console.log);
s.on("notification:count", console.log);