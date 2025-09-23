export type Message = {
  id: number;
  userId: number;
  scope: 'global' | 'local';
  msg: string;
  createdAt: Date;
};

export type IncomingMessage =
  | { type: 'join'; id: string }
  | { type: 'move'; x: number; y: number }
  | { type: 'chat'; scope: 'global' | 'local'; msg: string };

export type OutgoingMessage = { from: string; msg: string };

export type SaveMessageRequest = {
  senderId: string;
  scope: 'global' | 'local';
  message: string;
};

export type GetMessageListResponse = Message[];

export type GetMessageListRequest = {
  limit?: number;
  offset?: number;
  scope?: 'global' | 'local';
  senderId?: string;
  from?: Date;
  to?: Date;
  order?: 'asc' | 'desc';
};
