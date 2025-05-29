var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');


var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');
var articlesRouter = require('./routes/articles');
var articlecommentsRouter = require('./routes/articlecomments');
var productcommentsRouter = require('./routes/productcomments');
var documentsRouter = require('./routes/documents');




var errorHandler = require('./utils/errorHandler');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({ origin: 'http://localhost:4000' }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/articles', articlesRouter);
app.use('/articlecomments', articlecommentsRouter);
app.use('/productcomments', productcommentsRouter);
app.use('/documents', documentsRouter);




app.use(errorHandler);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
