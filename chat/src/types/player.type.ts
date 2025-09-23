import type { WebSocket } from 'ws';

export type Player = {
  id: string;
  username: string;
  ws: WebSocket;
};

export interface NearbyPlayer {
  id: string;
  x: number;
  y: number;
  dir: number;
}

export interface NearbyResponse {
  success: boolean;
  data: {
    players: NearbyPlayer[];
  };
}
