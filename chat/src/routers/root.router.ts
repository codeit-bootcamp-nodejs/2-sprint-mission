import Router from '@koa/router';
import { handleGetHealthCheck } from '../controllers/root.controller';

const root = new Router();

root.get('/', handleGetHealthCheck);

export default root;
