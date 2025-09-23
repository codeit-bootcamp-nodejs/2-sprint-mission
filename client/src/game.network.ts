import { setMyPlayer, addOrUpdateOtherPlayer, removeOtherPlayer, gameState } from './state';
import { Player } from './types';
import { getAuthToken, createWebSocket } from './socket';

let myId = '';
let gameSocket: WebSocket;

export function initGameNetwork() {
  gameSocket = createWebSocket(
    'wss://api.messagoom.online/game',
    (ws) => {
      const token = getAuthToken();
      if (token) {
        ws.send(JSON.stringify({ type: 'auth', token }));
      } else {
        ws.close();
      }
    },
    handleGameMessage,
    () => {},
    () => {}
  );
}

function handleGameMessage(data: any) {
  switch (data.type) {
    case 'auth':
    case 'reauth':
      if (data.success) {
        myId = data.id;
        setMyPlayer(data as Player);
      } else {
        gameSocket.close();
      }
      break;

    case 'state':
      data.players.forEach((p: Player) => {
        if (p.id === myId) setMyPlayer(p);
        else addOrUpdateOtherPlayer(p);
      });
      break;

    case 'playerMove':
      if (data.id === myId) setMyPlayer(data as Player);
      else addOrUpdateOtherPlayer(data as Player);
      break;

    case 'selfUpdate':
      setMyPlayer(data as Player);
      break;

    case 'nearbyPlayers':
      const newOthers: Record<string, Player> = {};
      data.players.forEach((p: Player) => {
        if (p.id === myId) setMyPlayer(p);
        else newOthers[p.id] = p;
      });
      gameState.otherPlayers = newOthers;
      break;

    case 'leave':
      removeOtherPlayer(data.id);
      break;
  }
}

export function sendMoveUpdate(player: Player) {
  if (gameSocket && gameSocket.readyState === WebSocket.OPEN && player.id) {
    gameSocket.send(
      JSON.stringify({
        type: 'move',
        id: player.id,
        username: player.username,
        x: player.x,
        y: player.y,
        dir: player.dir,
      })
    );
  }
}
