import { Context, Next } from 'koa';
import { errorResponse } from '../utils/response.util';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    const error = err as Error;
    const status = ctx.status !== 200 ? ctx.status : 500;

    ctx.status = status;
    ctx.body = errorResponse(status, error.message || 'Internal Server Error');

    console.error('ErrorHandler:', error);
  }
}
