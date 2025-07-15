import { Request, Response } from 'express';
import { uploadService } from '../services/upload.service';

export const uploadImages = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).send({ message: '업로드된 파일이 없습니다.' });
  }

  const urls = files.map((file) => uploadService.getFileUrl(req, file.filename));
  return res.send({ urls });
};
