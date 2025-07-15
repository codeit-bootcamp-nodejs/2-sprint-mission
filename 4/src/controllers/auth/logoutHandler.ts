import { RequestHandler } from "express";

const logoutHandler:RequestHandler = function(req, res, next){
    res.status(200).json({message: "logout success"});
}

export default logoutHandler;