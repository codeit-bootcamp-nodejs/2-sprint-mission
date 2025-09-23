import { Player, MapData } from './types';

// === 게임 상태 ===
export const gameState = {
  me: { id: '', username: '', x: 0, y: 0, dir: 0, color: 'red' } as Player,
  otherPlayers: {} as Record<string, Player>,
  mapData: [] as MapData,

  // 렌더링 관련 상태
  zBuffer: [] as number[],
  spriteTextures: {} as Record<string, CanvasImageSource>,
};

// === 내 플레이어 정보 설정 ===
export function setMyPlayer(player: Partial<Player>) {
  gameState.me = {
    ...gameState.me,
    ...player,
    username: player.username ?? gameState.me.username,
  };
}

// === 다른 플레이어 추가/업데이트 ===
export function addOrUpdateOtherPlayer(player: Player) {
  if (player.id === gameState.me.id) return;

  const existing = gameState.otherPlayers[player.id];
  gameState.otherPlayers[player.id] = {
    ...(existing ?? {}), // 기존 데이터 보존
    ...player,
    username: player.username ?? existing?.username ?? '',
  };
}

// === 다른 플레이어 제거 ===
export function removeOtherPlayer(playerId: string) {
  delete gameState.otherPlayers[playerId];
  delete gameState.spriteTextures[playerId]; // 해당 플레이어 텍스처 캐시도 삭제
}

// === 맵 데이터 설정 및 시작 위치 계산 ===
export function setMapData(mapData: MapData) {
  gameState.mapData = mapData;
  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {
      if (mapData[y][x] === 2) {
        setMyPlayer({ x: x + 0.5, y: y + 0.5 });
        return;
      }
    }
  }
}

// === ZBuffer 관리 ===
export function initZBuffer(width: number) {
  gameState.zBuffer = new Array(width).fill(Infinity);
}
export function setZBuffer(x: number, value: number) {
  gameState.zBuffer[x] = value;
}
export function getZBuffer(x: number) {
  return gameState.zBuffer[x];
}
