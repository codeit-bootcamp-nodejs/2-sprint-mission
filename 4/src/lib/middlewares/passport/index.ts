import passport from 'passport';
import {accessTokenStrategy, refreshTokenStrategy} from './jwtStrategy';
import localStrategy from './localStrategy';
import naverStrategy from './naverOAuthOnlyStrategy';
import discordStrategy from './discordStrategy';

passport.use(
    'local', 
    localStrategy
);

passport.use(
    'accessToken',
    accessTokenStrategy
);

passport.use(
    'refreshToken',
    refreshTokenStrategy
);

passport.use(
    'naver', 
    naverStrategy
);

passport.use(
    'discord', 
    discordStrategy
);

export default passport;
