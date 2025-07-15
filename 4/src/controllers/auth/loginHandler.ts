import { RequestHandler } from "express";
import { devDebug } from "../../lib/debugs";
import { generateToken } from "../../lib/tokens";

const loginHandler: RequestHandler = function (req, res, next) {
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const userId = req.user.id;
    devDebug(userId);
    const accessToken = generateToken(userId, "accessToken");
    const refreshToken = generateToken(userId, "refreshToken");
    
    res.status(200).json(
        {
            accessToken,
            refreshToken,
            message: "login success"
        }
    );
}

export default loginHandler;