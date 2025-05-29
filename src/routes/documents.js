var express = require('express');
const { db } = require('../utils/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();


const uploadDir = path.join(__dirname, '../../uploads');
const upload = multer({ dest: uploadDir });

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}



router.post('/upload', upload.single('file'), async (req, res, next) => {
    if (!req.file) {
        const error = new Error('No file uploaded');
        error.status = 404;
        return next(error); 
    }

  const { originalname, filename } = req.file;
  const extension = path.extname(originalname);
  const newFileName = filename + extension;
  const newFilePath = path.join(uploadDir, newFileName);
  fs.renameSync(req.file.path, newFilePath);


  res.json({ 
    message: '업로드 성공',
    newFilePath
 });
});

module.exports = router;
