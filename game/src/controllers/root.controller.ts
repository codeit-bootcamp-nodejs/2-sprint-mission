import { Context } from 'koa';
import { healthCheckService } from '../services/root.service';
import { successResponse } from '../utils/response.util';

export async function handleHealthCheck(ctx: Context) {
  const data = healthCheckService();
  ctx.status = 200;
  ctx.body = successResponse(data);
}
