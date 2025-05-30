const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');


const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const articlesRouter = require('./routes/articles');
const productcommentsRouter = require('./routes/productcomments');
const articlecommentsRouter = require('./routes/articlecomments');
const documentsRouter = require('./routes/documents');

const errorHandler = require('./utils/errorHandler');

const app = express();

// cors 연습 코드
app.use(cors({ origin: 'http://localhost:4000' }))
app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/articles', articlesRouter);
app.use('/articlecomments', articlecommentsRouter);
app.use('/productcomments', productcommentsRouter);
app.use('/documents', documentsRouter);

// http-errors 문법 연습 코드
app.use((req, res, next) => {
  next(createError(404, '요청한 리소스를 찾을 수 없습니다.'));
});


app.use(errorHandler);


module.exports = app;
