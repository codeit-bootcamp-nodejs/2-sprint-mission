import { gameState, setZBuffer } from './state';

export function drawWalls(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const { me, mapData } = gameState;
  if (!me || !mapData) return;

  const fov = Math.PI / 3;

  for (let x = 0; x < canvas.width; x++) {
    const rayAngle = me.dir - fov / 2 + (x / canvas.width) * fov;
    let distance = 0;
    let hit = false;

    while (!hit && distance < 20) {
      distance += 0.05;
      const hitX = me.x + Math.cos(rayAngle) * distance;
      const hitY = me.y + Math.sin(rayAngle) * distance;

      const tileX = Math.floor(hitX);
      const tileY = Math.floor(hitY);

      if (mapData[tileY]?.[tileX] === 1) {
        hit = true;
      }
    }

    if (hit) {
      const correctedDistance = distance * Math.cos(rayAngle - me.dir);
      setZBuffer(x, correctedDistance);

      const wallHeight = canvas.height / correctedDistance;
      const brightness = Math.max(0.2, 1 - distance / 10);
      const wallShade = Math.floor(136 * brightness);

      ctx.fillStyle = `rgb(${wallShade}, ${wallShade}, ${wallShade})`;
      ctx.fillRect(x, canvas.height / 2 - wallHeight / 2, 1, wallHeight);
    } else {
      setZBuffer(x, Infinity);
    }
  }
}
