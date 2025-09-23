import proxy from 'koa-proxies';
import Router from '@koa/router';
import { config } from '../config/config';

const game = proxy('/game', {
  target: config.external.game || 'http://localhost:3002',
  changeOrigin: true,
  logs: true,
  rewrite: (path: string) => path.replace(/^\/game/, ''),
});

export default game;
