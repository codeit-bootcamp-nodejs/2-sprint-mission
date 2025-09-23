import { Router } from 'express';
import upload from '../utils/upload';
import { uploadToS3 } from '../controllers/upload.controller';

const router = Router();

router.post('/', upload.single('image'), uploadToS3);

export default router;
