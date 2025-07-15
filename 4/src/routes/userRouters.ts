import express from 'express';
import userController from '../controllers/user/userController';
import passport from '../lib/middlewares/passport';
import {validateEmail} from "../lib/middlewares/validators";

const userRouters = express.Router();

userRouters.get(
    '/info',
    passport.authenticate('accessToken', { session: false }),
    userController.getUserInfoHandler
);

userRouters.get(
    '/info/products',
    passport.authenticate('accessToken', { session: false }),
    userController.getUserProductListHandler
);

userRouters.patch(
    '/info/update',
    passport.authenticate('accessToken', { session: false }),
    validateEmail,
    userController.updateUserInfoHandler
);

userRouters.patch(
    'info/password/update',
    passport.authenticate('accessToken', { session: false }),
    userController.updatePasswordHandler
);

export default userRouters;