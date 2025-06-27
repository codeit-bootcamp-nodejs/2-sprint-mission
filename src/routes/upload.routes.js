const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// 단일 이미지 업로드
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '파일이 없습니다.' });
  }

  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;