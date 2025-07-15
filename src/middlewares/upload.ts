import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, PUBLIC_PATH);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

function fileFilter(req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new BadRequestError('Only png, jpeg, and jpg are allowed'), false);
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter,
});

// ✅ 이미지 여러 개 업로드 시 사용할 미들웨어
export const uploadImages = upload.array('images', 10); // 한 번에 최대 10장
