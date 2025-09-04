import { Server } from "socket.io"
import { httpServer } from "./server";
import HttpError from "./types/httpError";
import { verifyAccessToken } from "./lib/token";
import { db } from "./lib/db";

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  }
});

io.on("connection", async (socket) => {
  try {

    // 프론트가 보낸다고 가정
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "토큰이 필요합니다.");
    }
    
    // 토큰 꺼내고 디코딩
    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);
    
    // payload 안의 유저 검증
    const user = await db.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw new HttpError(401, "유효하지 않은 유저입니다.");
    }
    
    // 소켓에 유저 데이터 넣기
    socket.data.user = user;
    
    // 유저별 소켓 룸에 조인
    socket.join(user.id.toString());

    console.log("유저 연결됨:", socket.data.user.id);

    socket.on("disconnect", () => {
      console.log("유저 연결 해제됨:", socket.data.user.id);
    });
  } catch (err) {
    console.log("소켓 인증 실패:", err);
    socket.disconnect();
  }
});


export { io };