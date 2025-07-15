import { RequestHandler } from "express";
import imageService from "../../services/image/imageService";

const uploadSingleImageHandler: RequestHandler = async function (req, res, next) {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const file = req.file;

    if(file != null){
        const userId = req.user.id;
        const receivedImage = await imageService.uploadSingleImage(userId, file);

        res.status(201).json(receivedImage);
    } else {
        res.status(400).json({message: "image not recieved"});
    }
}

export default uploadSingleImageHandler;