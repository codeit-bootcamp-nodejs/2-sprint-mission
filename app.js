const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const productRouter = require('./routes/product');
const articleRouter = require('./routes/article');
const commentRouter = require('./routes/comment');

const app = express();

// 미들웨어
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// 라우터
app.use('/product', productRouter);
app.use('/article', articleRouter);
app.use('/', commentRouter);

// localhost:3000/products/files/파일이름 으로 요청하면 uploads/파일이름 파일을 정적으로 서빙
app.use('/product/files', express.static('uploads'));

// 에러 핸들러
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 서버 실행중: http://localhost:${PORT}`);
});
