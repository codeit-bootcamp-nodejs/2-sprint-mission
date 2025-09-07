import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH, STATIC_PATH, AWS_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3'; //npm install @aws-sdk/client-s3

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export const upload = multer({
  // storage: multer.diskStorage({
  //   destination(req, file, cb) {
  //     cb(null, PUBLIC_PATH);
  //   },
  //   filename(req, file, cb) {
  //     const ext = path.extname(file.originalname);
  //     const filename = `${uuidv4()}${ext}`;
  //     cb(null, filename);
  //   },
  // }),

  storage: multerS3({
    s3: s3Client,
    bucket: AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err);
    }

    cb(null, true);
  },
});

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new BadRequestError('File required');
  }

  const file = req.file as Express.MulterS3.File;
  res.send({ url: file.location });
}
