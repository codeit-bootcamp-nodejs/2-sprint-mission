import type { WebSocket } from 'ws';

export type Player = {
  id: string;
  username: string;
  x: number;
  y: number;
  dir: number;
  ws: WebSocket;
  color: string;
};
