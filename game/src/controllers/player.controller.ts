import { Context } from 'koa';
import { movePlayer, getNearbyPlayerList } from '../services/player.service';
import { successResponse, errorResponse } from '../utils/response.util';

export async function handleMovePlayer(ctx: Context) {
  const { id, x, y, dir } = ctx.request.body as { id: string; x: number; y: number; dir: number };

  if (!id || x === undefined || y === undefined || dir === undefined) {
    ctx.status = 400;
    ctx.body = errorResponse(400, 'id, x, y, dir are required');
    return;
  }

  await movePlayer(id, x, y, dir);

  ctx.status = 200;
  ctx.body = successResponse({ message: 'Player moved successfully' });
}

export async function handleGetNearbyPlayerList(ctx: Context) {
  const id = ctx.state.user.id;
  const radius = Number(ctx.query.radius ?? 50);

  if (!id) {
    ctx.status = 400;
    ctx.body = errorResponse(400, 'id is required');
    return;
  }

  const players = await getNearbyPlayerList(id, radius);

  ctx.status = 200;
  ctx.body = successResponse({ players });
}
