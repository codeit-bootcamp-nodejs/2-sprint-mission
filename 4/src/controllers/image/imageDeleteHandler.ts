import { RequestHandler } from "express";
import imageService from "../../services/image/imageService";

const imageDeleteHandler: RequestHandler = async function (req, res, next) {

    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const encryptedString = req.params.encryptedString;
    const image = await imageService.imageDelete(userId,encryptedString);

    res.status(200).json(image);
};

export default imageDeleteHandler;