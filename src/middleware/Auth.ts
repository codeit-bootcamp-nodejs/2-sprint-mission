import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const Auth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("access-token", { session: false }, (err: any, user: any, info: any) => {
        if (err || !user) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }
        req.user = user;
        next();
    })(req, res, next); // passport.authenticate 미들웨어를 실행합니다.
};