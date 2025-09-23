import Router from '@koa/router';
import { handleGetMessageList } from '../controllers/message.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const messages = new Router({ prefix: '/messages' });

messages.get('/', authMiddleware, handleGetMessageList);

export default messages;
