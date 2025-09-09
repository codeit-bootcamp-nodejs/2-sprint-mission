import express, { Request, Response } from 'express';
import multer from 'multer';
import { getPublicUrl, putObject, s3Bucket } from '../config/s3';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allow = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allow.includes(file.mimetype)) return cb(new Error('Only png/jpg/webp allowed'));
    cb(null, true);
  },
});

router.get('/ping', (_req, res) => res.send('pong'));

router.post('/image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ ok: false, message: 'image 파일이 필요합니다.' });

    const ext = file.originalname.split('.').pop() ?? 'bin';
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    await putObject({
      Bucket: s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return res.status(201).json({
      ok: true,
      message: 'uploaded',
      bucket: s3Bucket,
      key,
      imageUrl: getPublicUrl(key),
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, message: err?.message ?? 'Upload failed' });
  }
});

export default router;