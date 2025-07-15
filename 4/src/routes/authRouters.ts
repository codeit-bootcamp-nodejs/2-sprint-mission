import express from 'express';
import authController from '../controllers/auth/authController';
import passport from '../lib/middlewares/passport';
import { validateEmail } from "../lib/middlewares/validators";
import stateValidator from '../lib/middlewares/passport/stateValidator';

const authRouters = express.Router();

authRouters.post(
    '/register',
    validateEmail,
    authController.registerHandler
);

authRouters.post(
    '/local/login',
    passport.authenticate('local', { session: false }),
    authController.loginHandler
);

// naver
authRouters.get(
    '/naver/login',
    passport.authenticate('naver', { session: false, authType: 'reprompt' })
);

authRouters.get(
    '/naver/callback',
    // stateValidator,
    passport.authenticate('naver', { session: false }),
    authController.loginHandler,
);

// discord
authRouters.get(
    '/discord/login',
    passport.authenticate('discord', { session: false })
);

authRouters.get(
    '/discord/callback',
    // stateValidator,
    passport.authenticate('discord', { session: false }),
    authController.loginHandler
);

authRouters.post(
    '/logout',
    authController.logoutHandler
);

authRouters.post(
    '/refresh',
    passport.authenticate('refreshToken', { session: false }),
    authController.refreshTokensHandler
)

export default authRouters;