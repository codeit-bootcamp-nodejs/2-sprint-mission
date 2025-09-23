import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH, STATIC_PATH, ENABLE_AWS_S3, AWS_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3'; //npm install @aws-sdk/client-s3

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;


let target_storage;
if (ENABLE_AWS_S3) {
  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });

  target_storage = multerS3({
    s3: s3Client,
    bucket: AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  });
} else {
  target_storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  });
}

export const upload = multer({
  storage: target_storage,

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
  if (ENABLE_AWS_S3) {
    if (!req.file) {
      throw new BadRequestError('File required');
    }

    const file = req.file as Express.MulterS3.File;
    res.send({ url: file.location });
  } else {
    const host = req.get('host');
    if (!host) {
      throw new BadRequestError('Host is required');
    }
    if (!req.file) {
      throw new BadRequestError('File is required');
    }
    const filePath = path.join(host, STATIC_PATH, req.file.filename);
    const url = `http://${filePath}`;
    res.send({ url });
  }
}
