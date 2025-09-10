// client.js
const { io } = require("socket.io-client");

// 로그인 후 발급받은 JWT 토큰
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTc1NTU4MTE2NSwiZXhwIjoxNzU1NjE3MTY1fQ.eP_cQ0i3Ck8B9tpFV9w5zFTY3qquyvXoiO21dzwztm8"

// 서버에 연결
const socket = io("http://localhost:3000", {
  auth: { token: accessToken } // 서버에서 검증
});

// 서버 연결 성공
socket.on("connect", () => {
  console.log("서버에 연결됨, socket id:", socket.id);
});

// 서버에서 알림 이벤트 수신
socket.on("notification:new", (notification) => {
  console.log("새 알림 수신:", notification);
});

// 연결 해제 시
socket.on("disconnect", () => {
  console.log("서버 연결 끊김");
});

// 연결 실패나 인증 실패 시
socket.on("connect_error", (err) => {
  console.error("연결 에러:", err.message);
});
