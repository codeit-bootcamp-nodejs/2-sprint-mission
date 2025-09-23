import { WebSocketServer, WebSocket, RawData } from 'ws';
import type { Server } from 'http';
import { saveMessage } from '../services/message.service';
import { NearbyResponse, Player } from '../types/player.type';
import axios from 'axios';
import { config } from '../config/config';
import { verifyAccessToken } from '../utils/jwt.util';

type PlayerWithToken = Player & { token: string };

const players = new Map<string, PlayerWithToken>();

export function setupChatWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/chat' });

  wss.on('connection', (ws: WebSocket) => {
    let current: PlayerWithToken | null = null;

    ws.on('message', async (msg: RawData) => {
      try {
        const data = JSON.parse(msg.toString());

        // --- 인증 처리 ---
        if (data.type === 'auth') {
          try {
            const payload = verifyAccessToken(data.token);
            current = { id: payload.id, ws, username: payload.username, token: data.token };
            players.set(current.id, current);

            console.log(`[서버] 플레이어 인증 성공: ${current.id}. 현재 접속자: ${players.size}명`);

            // 본인에게 인증 성공 응답
            ws.send(
              JSON.stringify({
                type: 'auth',
                success: true,
                id: current.id,
                username: current.username,
              })
            );

            // 다른 사람들에게 입장 알림
            players.forEach((p) => {
              if (p.id !== current!.id && p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(
                  JSON.stringify({
                    type: 'chat',
                    scope: 'global',
                    from: '관리자',
                    msg: `${current!.username}님이 입장하셨습니다.`,
                  })
                );
              }
            });
          } catch (authError) {
            console.error('[서버] 인증 토큰 오류:', authError);
            ws.send(JSON.stringify({ type: 'auth', success: false, error: 'Invalid token' }));
            ws.close();
          }
          return;
        }

        // --- 인증 검사 ---
        if (!current) {
          console.log('[서버] 인증되지 않은 유저의 메시지:', data);
          ws.send(JSON.stringify({ error: 'Not authenticated' }));
          return;
        }

        // --- 채팅 메시지 처리 ---
        if (data.type === 'chat') {
          const { scope, msg: message } = data;
          console.log(`[서버] 메시지 수신 from ${current.id}: [${scope}] ${message}`);

          await saveMessage({ senderId: current.id, scope, message });

          if (scope === 'global') {
            players.forEach((p) => {
              if (p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(
                  JSON.stringify({
                    type: 'chat',
                    scope: 'global',
                    from: current!.username,
                    msg: message,
                  })
                );
              }
            });
          } else if (scope === 'local') {
            try {
              const resp = await axios.get<NearbyResponse>(
                `${config.external.gateway}/game/players/nearby/${current.id}`,
                {
                  params: { radius: 1 },
                  headers: { Authorization: `Bearer ${current.token}` },
                }
              );

              console.log(`[서버] 로컬 메시지 대상자 조회:`, resp.data);

              const nearbyPlayers = resp.data?.data.players ?? [];

              nearbyPlayers.forEach((p: any) => {
                const target = players.get(p.id);
                if (target && target.ws.readyState === WebSocket.OPEN) {
                  target.ws.send(
                    JSON.stringify({
                      type: 'chat',
                      scope: 'local',
                      from: current!.username,
                      msg: message,
                    })
                  );
                }
              });

              // 본인에게도 메시지 돌려주기
              if (current.ws.readyState === WebSocket.OPEN) {
                current.ws.send(
                  JSON.stringify({
                    type: 'chat',
                    scope: 'local',
                    from: current.username,
                    msg: message,
                  })
                );
              }
            } catch (err) {
              console.error('[서버] 로컬 메시지 처리 오류:', err);
            }
          }
        }
      } catch (error) {
        console.error('[서버] 메시지 처리 중 심각한 오류 발생:', error);
      }
    });

    ws.on('close', () => {
      if (current) {
        players.delete(current.id);
        console.log(`[서버] 플레이어 접속 종료: ${current.id}. 현재 접속자: ${players.size}명`);

        players.forEach((p) => {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(
              JSON.stringify({
                type: 'chat',
                scope: 'global',
                from: '관리자',
                msg: `${current!.username}님이 퇴장하셨습니다.`,
              })
            );
          }
        });
      }
    });
  });

  console.log('WebSocket Chat server running on /chat');
}
