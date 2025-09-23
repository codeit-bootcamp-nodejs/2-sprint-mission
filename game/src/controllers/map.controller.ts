import { Context } from 'koa';
import { getMap, createMap, listMaps } from '../services/map.service';
import { CreateMapRequest } from '../types/map.type';

export async function handleGetMap(ctx: Context) {
  const { id } = ctx.params;
  const map = await getMap(id);
  if (!map) {
    ctx.status = 404;
    ctx.body = { success: false, error: 'Map not found' };
    return;
  }

  ctx.status = 200;
  ctx.body = { success: true, data: map };
}

export async function handleCreateMap(ctx: Context) {
  const { name, data } = ctx.request.body as CreateMapRequest;
  if (!name || !data) {
    ctx.status = 400;
    ctx.body = { success: false, error: 'Invalid payload' };
    return;
  }
  const map = await createMap(name, data);

  ctx.status = 201;
  ctx.body = { success: true, data: map };
}

export async function handleListMapList(ctx: Context) {
  const mapList = await listMaps();

  ctx.status = 200;
  ctx.body = { success: true, data: mapList };
}
