import http from "http";
import { initSocket } from "./utils/socket";
import app from "./app";

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

initSocket(server);

server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

export default server;