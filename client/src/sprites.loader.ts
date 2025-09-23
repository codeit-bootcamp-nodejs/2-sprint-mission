import { gameState } from './state';

function createColorSprite(color: string): HTMLCanvasElement {
  const width = 32;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas;
}

export function getSpriteTextureForPlayer(id: string, color: string): CanvasImageSource {
  if (!gameState.spriteTextures[id]) {
    gameState.spriteTextures[id] = createColorSprite(color);
  }
  return gameState.spriteTextures[id];
}
