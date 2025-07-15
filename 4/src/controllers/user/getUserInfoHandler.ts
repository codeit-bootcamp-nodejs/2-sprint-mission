import { devDebug } from "../../lib/debugs";
import uesrService from "../../services/user/userService";
import { RequestHandler } from "express";

const getUserInfoHandler:RequestHandler = async function(req, res, next){
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    
    const userId = req.user.id;
    const userInfo = await uesrService.getUserInfo(userId);

    res.status(200).json(userInfo);
};

export default getUserInfoHandler;