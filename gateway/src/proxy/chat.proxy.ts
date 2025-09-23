import proxy from 'koa-proxies';
import Router from '@koa/router';
import { config } from '../config/config';

const chat = proxy('/chat', {
  target: config.external.chat || 'http://localhost:3001',
  changeOrigin: true,
  logs: true,
  rewrite: (path: string) => path.replace(/^\/chat/, ''),
});

export default chat;
