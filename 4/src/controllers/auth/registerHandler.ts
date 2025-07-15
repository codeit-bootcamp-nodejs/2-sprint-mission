import authService from "../../services/auth/authService";
import { RequestHandler } from "express";

const registerHandler: RequestHandler = async function (req, res, next){
    const {email, password, nickname} = req.body;
    const newUser = await authService.register(email, password, nickname);

    res.status(200).json(newUser);
}

export default registerHandler;