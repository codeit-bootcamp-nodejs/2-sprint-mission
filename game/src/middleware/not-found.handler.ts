import { Context, Next } from 'koa';

export async function notFoundHandler(ctx: Context, next: Next) {
  await next();

  if (ctx.status === 404 && !ctx.body) {
    ctx.status = 404;
    ctx.body = {
      error: 'Not Found',
      path: ctx.path,
      method: ctx.method,
    };
  }
}
