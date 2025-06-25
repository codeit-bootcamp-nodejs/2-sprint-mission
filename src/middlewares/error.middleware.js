// const express = require('express');
// const router = express.Router();      // 실제로 라우터 기능 사용하지 않음

function errorHandler(err, req, res, next) {
    console.error(err.stack);

    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // 05.29 에러 핸들러 수정
    if (statusCode === 403) {
        return res.status(403).json({ error: 'Forbidden' });
    } else if (statusCode === 404) {
        return res.status(404).json({ error: 'Resource not found' });
    } else if (statusCode >= 400 && statusCode < 500) {
        return res.status(400).json({ error: 'Bad Request' });
    } else {
        return res.status(statusCode).json({ error: message });
    }
}
module.exports = errorHandler;
