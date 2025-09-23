import express from 'express';
import AuthController from '../controllers/auth.controller';
import { refreshToken } from '../utils/token';
import { withAsync } from '../utils/error';
import { validateUser } from '../middlewares/validators';

const router = express.Router();

router.post('/register', validateUser, withAsync(AuthController.register));

router.post('/login', withAsync(AuthController.login));

router.post('/logout', withAsync(AuthController.logout));

router.post('/refresh', withAsync(refreshToken));

export default router;