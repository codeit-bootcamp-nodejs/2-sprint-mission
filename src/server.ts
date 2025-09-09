import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { sockets } from './sockets'

const PORT = process.env.PORT || 5000;

// HTTP 서버로 감싸기
const server = http.createServer(app)

// Socket.IO 초기화 (같은 서버/포트 공유) 
sockets(server)

// 이제 app.listen(...)은 절대 호출하지 않음 : 이중 바인딩/포트 충돌 방지
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

/**
 * server.ts에 작성한 이유
 * 단일 TCP 서버에서 HTTP와 WS를 함께 서비스(동일 포트) -> 배포/프록시 설정 간단
 * app.ts는 프레임워크 레벨의 미들웨어/라우팅만 담당 -> 관심사 분리 가능
 */