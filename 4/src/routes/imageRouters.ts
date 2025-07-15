import express from 'express';
import passport from '../lib/middlewares/passport';
import imageController from '../controllers/image/imageController';
import imgUpload from '../lib/middlewares/imageFolderCreate';

const imageRouters = express.Router();

imageRouters.post(
    '/upload',
    passport.authenticate('accessToken', { session: false }),
    imgUpload.single('image'),
    imageController.uploadSingleImageHandler
);

imageRouters.get(
    '/:encodedEncryptedString',
    imageController.getImageHandler
);

imageRouters.delete(
    '/:encodedEncryptedString',
    passport.authenticate('accessToken', { session: false }),
    imageController.imageDeleteHandler
);

export default imageRouters;