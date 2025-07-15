import { devDebug } from "../../lib/debugs";
import uesrService from "../../services/user/userService";
import { RequestHandler } from "express";

const updateUserInfoHandler:RequestHandler = async function(req, res, next){
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    
    const userId = req.user.id;
    const {nickname, email} = req.body;
    const updatedUserInfo = await uesrService.updateUserInfo(userId, nickname, email);

    res.status(200).json(updatedUserInfo);
};

export default updateUserInfoHandler;