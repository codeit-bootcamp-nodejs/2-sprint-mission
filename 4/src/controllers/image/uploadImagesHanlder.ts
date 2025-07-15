import { RequestHandler } from "express";
import imageService from "../../services/image/imageService";

const uploadImagesHanlder: RequestHandler = async function (req, res, next) {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const files = req.files as MulterFile[];

    if(files != null && files.length !== 0){
        const userId = req.user.id;
        const receivedImages = await imageService.uploadImages(userId, files);

        res.status(201).json(receivedImages);
    } else {
        res.status(400).json({message: "image not recieved"});
    }
}

export default uploadImagesHanlder;