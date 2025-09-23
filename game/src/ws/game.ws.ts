import { WebSocketServer, WebSocket, RawData } from 'ws';
import type { Server } from 'http';
import { createPlayer, movePlayer, getNearbyPlayerList, removePlayer } from '../services/player.service';
import { verifyAccessToken } from '../utils/jwt.util';
import { getDefaultSpawnPoint } from '../services/map.service';
import { getRandomColor } from '../utils/color.util';
import { db } from '../db';
import { players } from '../db/schema';

const connections = new Map<string, WebSocket>();

export function setupGameWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/game' });

  function broadcast(message: any, exclude?: WebSocket) {
    const msg = JSON.stringify(message);
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN && ws !== exclude) {
        ws.send(msg);
      }
    });
  }

  wss.on('connection', (ws: WebSocket) => {
    let currentId: string | null = null;
    let currentUsername: string | null = null;

    ws.on('message', async (msg: RawData) => {
      try {
        const data = JSON.parse(msg.toString());

        // === 인증 처리 ===
        if (data.type === 'auth' || data.type === 'reauth') {
          try {
            const payload = verifyAccessToken(data.token);

            currentId = payload.id;
            currentUsername = payload.username;

            if (!currentId || !currentUsername) {
              throw new Error('Invalid token payload (missing id or username)');
            }

            const spawn = await getDefaultSpawnPoint();
            const color = getRandomColor();

            connections.set(currentId, ws);

            await removePlayer(currentId);
            await createPlayer(currentId, currentUsername, spawn.x + 0.5, spawn.y + 0.5, 0, color);

            // 인증 성공 응답 (username 포함)
            ws.send(
              JSON.stringify({
                type: data.type,
                success: true,
                id: currentId,
                username: currentUsername,
                x: spawn.x + 0.5,
                y: spawn.y + 0.5,
                dir: 0,
                color,
              })
            );

            // 전체 상태 브로드캐스트
            const all = await db.select().from(players);
            const fullState = {
              type: 'state',
              players: all.map((p) => ({
                id: p.id,
                username: p.username,
                x: p.x,
                y: p.y,
                dir: p.dir,
                color: p.color,
              })),
            };

            broadcast(fullState);
          } catch (err) {
            console.error('Auth error:', err);
            ws.send(
              JSON.stringify({
                type: data.type,
                success: false,
                error: 'Invalid token',
              })
            );
            ws.close();
          }
          return;
        }

        // === 인증 안 된 경우 ===
        if (!currentId || !currentUsername) {
          ws.send(JSON.stringify({ error: 'Not authenticated' }));
          return;
        }

        // === 이동 처리 ===
        if (data.type === 'move') {
          await movePlayer(currentId, data.x, data.y, data.dir);

          // 내 위치 업데이트 응답 (서버 저장 username만 사용)
          ws.send(
            JSON.stringify({
              type: 'selfUpdate',
              id: currentId,
              username: currentUsername,
              x: data.x,
              y: data.y,
              dir: data.dir,
            })
          );

          // 다른 플레이어에게 브로드캐스트
          broadcast(
            {
              type: 'playerMove',
              id: currentId,
              username: currentUsername,
              x: data.x,
              y: data.y,
              dir: data.dir,
            },
            ws
          );

          // 근처 플레이어 목록 보내주기
          const nearby = await getNearbyPlayerList(currentId, 50);
          ws.send(
            JSON.stringify({
              type: 'nearbyPlayers',
              players: nearby.map((p) => ({
                id: p.id,
                username: p.username,
                x: p.x,
                y: p.y,
                dir: p.dir,
                color: p.color,
              })),
            })
          );
        }
      } catch (err) {
        console.error('Invalid WS message:', err);
      }
    });

    // === 연결 종료 처리 ===
    ws.on('close', async () => {
      if (currentId) {
        connections.delete(currentId);
        await removePlayer(currentId);
        console.log(`[서버] 플레이어 접속 종료: ${currentId}. 현재 접속자: ${connections.size}명`);
        broadcast({ type: 'leave', id: currentId });
      }
    });
  });

  console.log('WebSocket Game server running on /game');
}
