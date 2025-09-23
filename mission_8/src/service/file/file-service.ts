import express from 'express';
import multer from 'multer';

const upload = multer({ dest: 'uploads/'});

class FileService {
  static uploadFile: express.RequestHandler = async (req, res, next) => {
    try {
      const path = `/file/${req.file?.filename}`;
      res.json({ path });
    } catch (err) {
      next(err);
    }
  }
}

export default FileService;