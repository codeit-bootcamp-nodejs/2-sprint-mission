import Router from '@koa/router';
import { authMiddleware } from '../middleware/auth.middleware';
import { handleCreateMap, handleGetMap, handleListMapList } from '../controllers/map.controller';

const maps = new Router({ prefix: '/maps' });

maps.get('/', authMiddleware, handleListMapList);
maps.post('/', authMiddleware, handleCreateMap);
maps.get('/:id', authMiddleware, handleGetMap);

export default maps;
