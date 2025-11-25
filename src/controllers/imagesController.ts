import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH, STATIC_PATH, IS_PRODUCTION } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';

const multerS3 = require('multer-s3'); // require로 import
const { s3Client } = require('../config/s3.config'); // require로 import

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// 로컬 스토리지 설정 (개발 환경)
const localStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, PUBLIC_PATH);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// S3 스토리지 설정 (프로덕션 환경)
let storageConfig: any;
if (IS_PRODUCTION) {
  storageConfig = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: any, file: any, cb: any) {
      const ext = path.extname(file.originalname);
      const filename = `${STATIC_PATH}/${uuidv4()}${ext}`;
      cb(null, filename);
    },
  });
} else {
  storageConfig = localStorage;
}

export const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
  fileFilter: function (req, file, cb: any) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err);
    }
    cb(null, true);
  },
});

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new BadRequestError('File is required');
  }

  let url: string;

  if (IS_PRODUCTION) {
    // S3 URL 생성
    const location = (req.file as any).location;
    url =
      location ||
      `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${(req.file as any).key}`;
  } else {
    // 로컬 URL 생성
    const host = req.get('host');
    if (!host) {
      throw new BadRequestError('Host is required');
    }
    const filePath = path.join(STATIC_PATH, req.file.filename);
    url = `http://${host}/${filePath}`;
  }

  res.send({ url });
}
