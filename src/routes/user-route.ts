import express from 'express';
import authenticate from '../middlewares/authenticate';
import UserController from '../controllers/user-controller';

const router = express.Router();

// this 바인딩을 유지하기 위해 bind 사용
router.post('/create', UserController.createUser.bind(UserController));
router.post('/login', UserController.login.bind(UserController));
router.post('/refresh', UserController.refreshTokens.bind(UserController));
router.get('/info', authenticate, UserController.inform.bind(UserController));
router.patch('/change', authenticate, UserController.change.bind(UserController));
router.get('/productList', authenticate, UserController.productList.bind(UserController));

export default router;
