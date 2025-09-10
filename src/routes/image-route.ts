import express from 'express';
import { upload } from '../config/s3'
import UploadController from '../controllers/image-controller';

const router = express.Router();


router.post('/upload', upload.single('attachment'), UploadController.uploadFile.bind(UploadController));

export default router;
