
import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  signup,
  login,
  logout,
  getMyProfile,
  updateMyProfile,
  deleteUser
} from '../controllers/usersController.js';


const userRouter = express.Router();

userRouter.post('/signup', withAsync(signup));
userRouter.post('/login', withAsync(login));
userRouter.post('/logout', authMiddleware, withAsync(logout));
userRouter.get('/me', authMiddleware, withAsync(getMyProfile));
userRouter.patch('/me', authMiddleware, withAsync(updateMyProfile));
userRouter.delete('/me', authMiddleware, withAsync(deleteUser));


export default userRouter;




// 새로 추가 한 부분 
import { getMyProfile } from '../controllers/user.controller';

router.get('/me', authMiddleware, getMyProfile);