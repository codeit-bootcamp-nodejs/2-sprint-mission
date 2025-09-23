import http from 'http';
import app from './app';
import { setupChatWebSocket } from './ws/chat.ws';

const PORT = process.env.PORT || 3001;

// HTTP 서버
const server = http.createServer(app.callback());

// WebSocket 서버
setupChatWebSocket(server);

server.listen(PORT, () => {
  console.log(`Chat service running on http://localhost:${PORT}`);
});
