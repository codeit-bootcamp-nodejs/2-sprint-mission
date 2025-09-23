import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  registerUser,
  login,
  getMe,
  updateMe,
  changePassword,
  getMyProducts,     
} from '../controllers/usersController.js';
import { authMiddleware } from '../middlewares/auth.js';

const usersRouter = express.Router();

usersRouter.post('/register', withAsync(registerUser));
usersRouter.post('/login', withAsync(login));

usersRouter.get('/me', authMiddleware, withAsync(getMe));
usersRouter.patch('/me', authMiddleware, withAsync(updateMe));
usersRouter.patch('/me/password', authMiddleware, withAsync(changePassword));


usersRouter.get('/me/products', authMiddleware, withAsync(getMyProducts));
usersRouter.get('/me/articles', authMiddleware, withAsync(getMyArticles));

export default usersRouter;
