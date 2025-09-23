import Router from '@koa/router';
import { handleMovePlayer, handleGetNearbyPlayerList } from '../controllers/player.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const players = new Router({ prefix: '/players' });

players.post('/move', authMiddleware, handleMovePlayer);
players.get('/nearby/:id', authMiddleware, handleGetNearbyPlayerList);

export default players;
