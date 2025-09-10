import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("access-token", { session: false }, (err: any, user: any, info: any) => {
        if (user) {
            req.user = user; // 유효한 토큰이 있으면 req.user에 사용자 정보 할당
        }
        next();
    })(req, res, next);
};