export function drawFloorAndCeiling(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.fillStyle = '#87CEEB'; // 하늘색
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  ctx.fillStyle = '#444'; // 어두운 회색 바닥
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
}
