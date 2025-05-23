const express = require('express');
const morgan = require('morgan');

const productRouter = require('./routes/product');
const articleRouter = require('./routes/article');
const commentRouter = require('./routes/comment');

const app = express();

// 미들웨어
app.use(morgan);
app.use(cors());
app.use(express.json());

app.use('/product', productRouter);
app.use('/article', articleRouter);
app.use('/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler -> 404에러 여기로 이동
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).send('❌ ERROR: ' + err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 서버 실행중: http://localhost:${PORT}`);
});
