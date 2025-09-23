export type MapData = number[][];

export interface Player {
  id: string;
  username: string;
  x: number;
  y: number;
  dir: number;
  color: string;
}

// 서버로부터 받는 메시지 형식
export interface ServerChatMessage {
  from: string;
  msg: string;
}

// 서버로 보내는 메시지 형식
export interface ClientChatMessage {
  type: 'chat';
  scope: 'global' | 'local';
  msg: string;
}
