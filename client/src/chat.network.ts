import { addMessageToBox } from './ui';
import { ClientChatMessage } from './types';
import { getAuthToken, createWebSocket } from './socket';

let myId = '';
let myUsername = '';
let chatSocket: WebSocket;

export function initChatNetwork() {
  chatSocket = createWebSocket(
    'wss://api.messagoom.online/chat',
    (ws) => {
      console.log('Chat connected. Authenticating...');
      const token = getAuthToken();
      if (token) {
        ws.send(JSON.stringify({ type: 'auth', token }));
      } else {
        console.error('Chat authentication failed: Token not found.');
        ws.close();
      }
    },
    handleChatMessage,
    () => console.log('Chat connection closed.'),
    (err) => console.error('Chat WebSocket Error:', err)
  );
}

function handleChatMessage(data: any) {
  switch (data.type) {
    case 'auth':
      if (data.success) {
        myId = data.id;
        myUsername = data.username;
        console.log(`Chat authenticated. ID: ${myId}, Username: ${myUsername}`);
      } else {
        console.error('Chat authentication failed:', data.error);
        chatSocket.close();
      }
      break;

    case 'chat':
      if (data.from && data.msg) {
        const scope = data.scope === 'local' ? 'local' : 'global';

        if (data.from === '관리자') {
          addMessageToBox('관리자', data.msg, false, scope);
          return;
        }

        const isMine = data.from === myUsername;
        addMessageToBox(data.from, data.msg, isMine, scope);
      } else {
        console.warn('Malformed chat message received:', data);
      }
      break;

    default:
      console.log('Unhandled chat message:', data);
      break;
  }
}

// 이제 scope 인자를 받음
export function sendChatMessage(message: string, scope: 'global' | 'local' = 'global') {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    const chatMessage: ClientChatMessage = {
      type: 'chat',
      scope,
      msg: message,
    };
    chatSocket.send(JSON.stringify(chatMessage));
  }
}
