import express from 'express';
import passport from '../lib/middlewares/passport';
import imageController from '../controllers/image/imageController';
import imgUpload from '../lib/middlewares/imageFolderCreate';

const imagesRouters = express.Router();

imagesRouters.post(
    '/upload',
    passport.authenticate('accessToken', { session: false }),
    imgUpload.array('images', 10),
    imageController.uploadImagesHanlder
);

export default imagesRouters;