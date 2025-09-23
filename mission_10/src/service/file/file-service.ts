import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are not properly configured');
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

class FileService {
  static uploadFile: express.RequestHandler = (req, res, next) => {
    try {
      const upload = multer({
        storage: multerS3({
          s3: s3Client,
          bucket: process.env.AWS_BUCKET_NAME as string,
          metadata: (req, file, cb) => {
            cb(null, {});
          },
          key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
          },
        })
      }).single('file');

      return upload(req, res, (err) => {
        if (err) {
          return next(err);
        }
        
        if (!req.file) {
          return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
        }
        
        const file = req.file as Express.MulterS3.File;
        const fileKey = file.key;
        const fileUrl = file.location;
        
        return res.json({ fileKey, fileUrl });
      });
    } catch (err) {
      return next(err);
    }
  }
  static getFile: express.RequestHandler = async (req, res, next) => {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: req.body.fileKey, // 불러올 파일 경로
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

      res.json({ url });
    } catch (err) {
      next(err);
    }
  }
}

export default FileService;