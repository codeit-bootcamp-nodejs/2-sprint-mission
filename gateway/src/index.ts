import http from 'http';
import app from './app';
import { config } from './config/config';
import httpProxy from 'http-proxy';

const server = http.createServer(app.callback());

// ws 프록시 서버
const wsProxy = httpProxy.createProxyServer({});

// 업그레이드 이벤트 처리
server.on('upgrade', (req, socket, head) => {
  if (req.url?.startsWith('/chat')) {
    wsProxy.ws(req, socket, head, {
      target: config.external.chat || 'http://chat:3001',
    });
  } else if (req.url?.startsWith('/game')) {
    wsProxy.ws(req, socket, head, {
      target: config.external.game || 'http://game:3002',
    });
  } else {
    socket.destroy();
  }
});

server.listen(config.app.port, () => {
  console.log(`Gateway running on http://localhost:${config.app.port}`);
});
