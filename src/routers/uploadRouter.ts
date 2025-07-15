import express from 'express';
import { uploadImages } from '../middlewares/upload';
import { uploadImages as uploadImagesController } from '../controllers/upload.controller';

const router = express.Router();

router.post('/uploads', uploadImages, uploadImagesController);

export default router;
