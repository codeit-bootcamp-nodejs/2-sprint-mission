import { RequestHandler } from "express";
import { generateToken } from "../../lib/tokens";
import { devDebug } from "../../lib/debugs";

const refreshTokensHandler:RequestHandler = function(req, res, next){
    if (!req.user) {
        devDebug("refresh");
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const userId = req.user.id;
    const accessToken = generateToken(userId, "accessToken");
    const refreshToken = generateToken(userId, "refreshToken");

    res.status(200).json({
        accessToken,
        refreshToken
    });
}

export default refreshTokensHandler;