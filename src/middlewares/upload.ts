import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { randomUUID } from 'crypto';
import { s3 } from '../config/s3';

/** 허용할 MIME 타입 (원하면 추가) */
const ALLOWED_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
]);

/** 파일 필터: 허용된 MIME만 업로드 */
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_MIMES.has(file.mimetype)) return cb(null, true);
  cb(new Error('Only image uploads are allowed'));
};

/** 파일명 생성 (prefix/yyyy/mm/uuid.ext) */
function makeS3Key(originalName: string) {
  const now = new Date();
  const y = String(now.getFullYear());
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const ext = path.extname(originalName);
  return `uploads/${y}/${m}/${randomUUID()}${ext}`;
}

/**
 * 로컬 개발에서 S3 액세스 키가 없으면,
 * 메모리 저장으로 대체하고, 라우트에서 503 반환하도록 유도
 */
const missingAwsKeys =
  !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY;

let upload: multer.Multer;

if (missingAwsKeys) {
  console.warn('[upload] AWS credentials missing. Using memory storage only.');
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
  });
} else {
  upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_S3_BUCKET!,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (_req, file, cb) => cb(null, makeS3Key(file.originalname)),
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
  });
}

export default upload;

/** multer-s3가 붙여주는 필드 타입 보강용 (응답에서 req.file.location 사용) */
export interface MulterS3File extends Express.Multer.File {
  location: string;
  key: string;
  bucket: string;
  etag: string;
}
