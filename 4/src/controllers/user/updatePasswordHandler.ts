import { devDebug } from "../../lib/debugs";
import uesrService from "../../services/user/userService";
import { RequestHandler } from "express";

const updatePasswordHandler: RequestHandler = async function(req, res, next){
    if (!req.user) {
        devDebug(req.user);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const {newPassword }= req.body;

    const status = await uesrService.updatePassword(userId, newPassword);

    res.status(200).json(status);
};

export default updatePasswordHandler;