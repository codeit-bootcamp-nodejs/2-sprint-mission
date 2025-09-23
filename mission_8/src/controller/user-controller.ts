import express from 'express';
import authService from '../service/user/auth-service';
import userService from '../service/user/user-service';
import passport from '../lib/passport/index';
import { loginLimiter } from '../utills/loginLimiter';
const userController = express.Router();

userController.post('/register', authService.register);
userController.delete('/unregister',
  passport.authenticate('access-token', { session: false }),
  authService.unRegister);
userController.post('/login', 
  loginLimiter,
  passport.authenticate('local', { session: false }),
  authService.login);
userController.post('/refresh',
  passport.authenticate('refresh-token', { session: false }),
  authService.refresh);
userController.post('/logout', authService.logout);

userController.get('/',
  passport.authenticate('access-token', { session: false }),
  userService.getUser);
userController.patch('/',
  passport.authenticate('access-token', { session: false }),
  userService.updateUser);
userController.patch('/password',
  passport.authenticate('access-token', { session: false }),
  userService.updatePassword);
userController.get('/products',
  passport.authenticate('access-token', { session: false }),
  userService.getUserProducts);
userController.get('/articles',
  passport.authenticate('access-token', { session: false }),
  userService.getUserArticles);

export default userController;