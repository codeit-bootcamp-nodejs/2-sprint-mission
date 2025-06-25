const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const productRoutes = require('./src/routes/product.route');
const articleRoutes = require('./src/routes/article.route');
const commentRoutes = require('./src/routes/comment.route');
const authRoutes = require('./src/routes/auth.route');
const errorHandler = require('./src/middlewares/error.middleware');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// 라우터 연결
app.use('/product', productRoutes);
app.use('/article', articleRoutes);
app.use('/', commentRoutes); // comment는 product/article path 하위에 있으므로 base URL은 '/'
app.use('/', authRoutes)

// 파일 정적 서빙
app.use('/product/files', express.static('uploads'));

// 에러 핸들러
app.use(errorHandler);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`🚀 서버 실행중: http://localhost:${PORT}`);
});
module.exports = app;
