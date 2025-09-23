import Router from '@koa/router';
import { handleHealthCheck } from '../controllers/root.controller';

const root = new Router();

root.get('/', handleHealthCheck);

export default root;
