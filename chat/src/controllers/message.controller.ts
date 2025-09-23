import { Context } from 'koa';
import { getMessageList } from '../services/message.service';
import { GetMessageListRequest } from '../types/message.type';
import { successResponse } from '../utils/response.util';

export async function handleGetMessageList(ctx: Context) {
  const params: GetMessageListRequest = {
    limit: ctx.query.limit ? parseInt(ctx.query.limit as string, 10) : 50,
    offset: ctx.query.offset ? parseInt(ctx.query.offset as string, 10) : 0,
    scope: ctx.query.scope as 'global' | 'local' | undefined,
    senderId: ctx.query.senderId as string | undefined,
    from: ctx.query.from ? new Date(ctx.query.from as string) : undefined,
    to: ctx.query.to ? new Date(ctx.query.to as string) : undefined,
    order: (ctx.query.order as 'asc' | 'desc') || 'asc',
  };

  const messages = await getMessageList(params);

  ctx.status = 200;
  ctx.body = successResponse(messages);
}
