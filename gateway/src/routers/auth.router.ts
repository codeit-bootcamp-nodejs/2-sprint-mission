import Router from '@koa/router';
import { handleMe, handleRefresh, handleSignIn, handleSignUp } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const auth = new Router({ prefix: '/auth' });

auth.post('/signup', handleSignUp);
auth.post('/signin', handleSignIn);
auth.post('/refresh', authMiddleware, handleRefresh);
auth.get('/me', authMiddleware, handleMe);

export default auth;
