// src/app.js (수정된 내용)
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/product.routes');
const uploadRoutes = require('./routes/upload.routes'); 
const articleRoutes = require('./routes/article.routes');
// const commentRoutes = require('./routes/comment.routes'); // 주석 처리 
const imageRoutes = require('./routes/image.routes');
const path = require('path');

const app = express();

require('dotenv').config();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트
app.use('/products', productRoutes);
app.use('/upload', uploadRoutes); 
app.use('/articles', articleRoutes);
// app.use('/comments', commentRoutes); // 주석 처리
app.use('/api/upload', imageRoutes); 
// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 에러 처리 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || '서버 내부 에러 발생!',
    });
});

module.exports = app;