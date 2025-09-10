import app from './app';
import debugModule from 'debug';
import http from 'http';
import { AddressInfo } from 'net'; 
import { connectSocket } from './socket';


const debug = debugModule('used-shop:server');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// 기존 http 서버 생성
const server = http.createServer(app);

// socket.io 연결
const io = connectSocket(server);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: string): number | string | false {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number
  return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind =
    typeof addr === 'string'
      ? 'pipe ' + addr
      : addr && typeof addr === 'object'
        ? 'port ' + (addr as AddressInfo).port
        : 'unknown';

  debug('Listening on ' + bind);
}