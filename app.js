const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

const productRoutes = require('./src/routes/product.route');
const articleRoutes = require('./src/routes/article.route');
const commentRoutes = require('./src/routes/comment.route');
const authRoutes = require('./src/routes/auth.route');
const errorHandler = require('./src/middlewares/error.middleware');
const { PORT } = require('./src/lib/constants');
const cookieParser = require('cookie-parser');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(passport.initialize()); // passport 초기화

// 라우터 연결
app.use('/product', productRoutes);
app.use('/article', articleRoutes);
app.use('/', commentRoutes);
app.use('/auth', authRoutes);

// 파일 정적 서빙
app.use('/product/files', express.static('uploads'));

// 에러 핸들러
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 서버 실행중: http://localhost:${PORT}`);
});

module.exports = app;
