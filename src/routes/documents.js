var express = require('express');
const { db } = require('../utils/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 경로 지정
const uploadDir = path.join(__dirname, '../../uploads');
const upload = multer({ dest: uploadDir });

// 경로 확인 및 생성
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}



router.post('/upload', upload.single('file'), async (req, res, next) => {
    if (!req.file) {
        const error = new Error('No file uploaded');
        error.status = 404;
        return next(error); 
    }

  const { originalname, filename } = req.file;           // 원래이름과 임시이름 지정
  const extension = path.extname(originalname);          // 확장자명 가져오기
  const newFileName = filename + extension;              // 임시이름에 확장자 붙이기
  const newFilePath = path.join(uploadDir, newFileName); // 새로 만든 파일 경로 만들어주기
  fs.renameSync(req.file.path, newFilePath);             // 구 경로를 새 경로로 변경


  res.json({ 
    message: '업로드 성공',
    newFilePath
 });
});

module.exports = router;
