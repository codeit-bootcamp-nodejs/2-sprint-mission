import loginHandler from './loginHandler';
import logoutHandler from './logoutHandler';
import registerHandler from './registerHandler';
import refreshTokensHandler from './refreshTokensHandler';

const authController = {
    registerHandler,
    loginHandler,
    logoutHandler,
    refreshTokensHandler
};

export default authController;