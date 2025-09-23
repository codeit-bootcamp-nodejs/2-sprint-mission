import { gameState, initZBuffer } from './state';
import { drawFloorAndCeiling } from './floorCeiling';
import { drawWalls } from './walls';
import { drawOtherPlayers } from './sprites';

let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;

export function initRenderer(_canvas: HTMLCanvasElement) {
  canvas = _canvas;
  ctx = canvas.getContext('2d')!;
  canvas.width = 640;
  canvas.height = 400;
  initZBuffer(canvas.width);
}

export function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. 바닥 + 천장
  drawFloorAndCeiling(ctx, canvas);

  // 2. 벽 (zBuffer 채움)
  if (gameState.mapData) {
    drawWalls(ctx, canvas);
  }

  // 3. 스프라이트 (다른 플레이어)
  if (gameState.me) {
    drawOtherPlayers(ctx, canvas);
  }
}
