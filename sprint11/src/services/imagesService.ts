import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { AWS_S3_BUCKET_NAME, BASE_URL, NODE_ENV, PUBLIC_PATH, STATIC_PATH } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import s3Client from '../lib/s3Client';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const generateFilename = (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname).toLowerCase();
  return `${uuidv4()}${ext}`;
};

export const upload = multer({
  storage:
    NODE_ENV === 'production'
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination(req, file, cb) {
            cb(null, PUBLIC_PATH);
          },
          filename(req, file, cb) {
            cb(null, generateFilename(file));
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

export async function uploadImage(file?: Express.Multer.File) {
  if (NODE_ENV === 'production') {
    return uploadImageToS3(file);
  }
  return uploadImageLocal(file);
}

async function uploadImageLocal(file?: Express.Multer.File) {
  if (!file) {
    throw new BadRequestError('File is required');
  }
  const url = `${BASE_URL}${STATIC_PATH}/${file.filename}`;
  return url;
}

async function uploadImageToS3(file?: Express.Multer.File) {
  if (!file) {
    throw new BadRequestError('File is required');
  }

  if (!s3Client) {
    throw new Error('S3 client is not initialized');
  }

  const key = generateFilename(file);

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload image');
  }

  const url = `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  return url;
}
