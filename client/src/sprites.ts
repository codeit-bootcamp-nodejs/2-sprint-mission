import { gameState, getZBuffer } from './state';
import { getSpriteTextureForPlayer } from './sprites.loader';

export function drawOtherPlayers(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const { me, otherPlayers } = gameState;
  if (!me) return;

  const fov = Math.PI / 3;
  const projectionPlane = canvas.width / (2 * Math.tan(fov / 2));
  const worldHeight = 0.8; // 플레이어 키 (월드 단위)
  const cameraHeight = worldHeight / 2; // 눈높이 = 키 절반

  for (const id in otherPlayers) {
    const p = otherPlayers[id];
    const dx = p.x - me.x;
    const dy = p.y - me.y;

    // === 거리 & 각도 계산 ===
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angleToSprite = Math.atan2(dy, dx);
    let angleDiff = angleToSprite - me.dir;
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    if (Math.abs(angleDiff) > fov / 2) continue;

    // === 보정된 거리 (fish-eye 보정) ===
    const correctedDistance = distance * Math.cos(angleDiff);

    // === 투영 ===
    const screenX = canvas.width / 2 + Math.tan(angleDiff) * projectionPlane;

    // DOOM 스타일 스프라이트 크기
    const spriteScreenHeight = (canvas.height / correctedDistance) * worldHeight;
    const spriteScreenWidth = spriteScreenHeight * (32 / 64);

    // 바닥 기준 계산 (카메라 높이 반영)
    const bottomY = canvas.height / 2 + (cameraHeight / correctedDistance) * projectionPlane;
    const topY = bottomY - spriteScreenHeight;

    const startX = Math.floor(screenX - spriteScreenWidth / 2);
    const endX = Math.floor(screenX + spriteScreenWidth / 2);

    const texture = getSpriteTextureForPlayer(p.id, p.color);

    // === 스프라이트 column 단위 그리기 (ZBuffer 사용) ===
    for (let x = startX; x < endX; x++) {
      if (x < 0 || x >= canvas.width) continue;
      if (correctedDistance >= getZBuffer(x)) continue;

      ctx.drawImage(texture, 0, 0, 32, 64, x, topY, 1, spriteScreenHeight);
    }

    // === username 표시 ===
    if (p.username && correctedDistance < Infinity) {
      const fontSize = Math.max(10, spriteScreenHeight * 0.2);

      ctx.imageSmoothingEnabled = false;
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      const textX = screenX;
      const textY = topY - 5;

      const midX = Math.floor(screenX);
      if (midX >= 0 && midX < canvas.width && correctedDistance < getZBuffer(midX)) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(p.username, textX, textY);

        ctx.fillStyle = 'white';
        ctx.fillText(p.username, textX, textY);
      }
    }
  }
}
