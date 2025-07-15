const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const healthcheck = require('../utils/index.js');
const productRouter = require('../features/usedProduct.js');
const freeBoardRouter = require('../features/freeBoard.js');
const commentRouter = require('../features/comment.js');
const imgRouter = require('../features/imgOp.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', healthcheck);
app.use('/product', productRouter);
app.use('/freeboard', freeBoardRouter);
app.use('/comment', commentRouter);
app.use('/image', imgRouter);

app.use((_req, _res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).send('ERROR: ' + err.message);
});

module.exports = app;