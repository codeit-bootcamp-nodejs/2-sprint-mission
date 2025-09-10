import multer from 'multer';
import { S3Client } from "@aws-sdk/client-s3";
import {
  AWS_REGION, AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET
} from '../lib/constants'


export const upload = multer({storage : multer.memoryStorage()})


export const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const bucketName = AWS_S3_BUCKET