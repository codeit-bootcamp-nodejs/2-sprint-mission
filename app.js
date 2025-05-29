var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');
var articlesRouter = require('./routes/articles');
var articlecommentsRouter = require('./routes/articlecomments');
var productcommentsRouter = require('./routes/productcomments');
var documentsRouter = require('./routes/documents');

var errorHandler = require('./utils/errorHandler');

var app = express();

app.use(cors({ origin: 'http://localhost:4000' }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/articles', articlesRouter);
app.use('/articlecomments', articlecommentsRouter);
app.use('/productcomments', productcommentsRouter);
app.use('/documents', documentsRouter);


app.use((req, res, next) => {
  next(createError(404, '요청한 리소스를 찾을 수 없습니다.'));
});


app.use(errorHandler);


module.exports = app;
