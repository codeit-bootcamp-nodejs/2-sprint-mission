import express from 'express';
import multer from 'multer';

const fileRouter = express.Router();
const upload = multer({ dest: 'uploads/'});


fileRouter.post('', upload.single('file'), (req, res, next) => {
  const path = `/file/${req.file.filename}`;
  res.json({ path });
});

export default fileRouter;