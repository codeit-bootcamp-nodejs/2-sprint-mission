import { fetchMapData } from './api';
import { setMapData } from './state';
import { initGameNetwork, initChatNetwork } from './network';
import { initRenderer, render } from './renderer';
import { initInputHandlers, handleKeyboardInput } from './input';
import { initChatUI } from './ui';
import { sendChatMessage } from './chat.network';

let gameLoopStarted = false;

export async function startGame(): Promise<void> {
  try {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('캔버스를 찾을 수 없습니다 (#gameCanvas).');
    }

    // 1. 렌더러 초기화
    initRenderer(canvas);

    // 2. 입력 핸들러 등록
    initInputHandlers();

    // 3. 맵 불러오기
    const mapData = await fetchMapData();
    setMapData(mapData);

    // 4. 네트워크 초기화
    initGameNetwork();
    initChatNetwork();

    // 5. UI 초기화
    initChatUI((message, scope) => {
      sendChatMessage(message, scope);
    });

    // 6. 게임 루프 시작
    if (!gameLoopStarted) {
      gameLoopStarted = true;
      function gameLoop() {
        handleKeyboardInput();
        render();
        requestAnimationFrame(gameLoop);
      }
      gameLoop();
    }
  } catch (error) {
    console.error('게임 시작 실패:', error);
  }
}
