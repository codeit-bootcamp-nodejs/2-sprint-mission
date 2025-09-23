import http from 'http';
import app from './app';
import { config } from './config/config';
import { setupGameWebSocket } from './ws/game.ws';

const server = http.createServer(app.callback());

// WebSocket 서버 붙이기
setupGameWebSocket(server);

server.listen(config.app.port, () => {
  console.log(`Game service running on http://localhost:${config.app.port}`);
});
