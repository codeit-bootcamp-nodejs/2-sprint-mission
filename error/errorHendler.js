const express = require('express');
const router = express.Router();

function errorHandler(err, req, res, next) {
    console.error(err.stack);

    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // 404 Not Found
    if (err.status === 404) {
        return (message = 'Resource not found');
    }

    if (statusCode >= 400 && statusCode < 500) {
        return message || 'Bad Request';
    }

  if (statusCode >= 500) {
     return 'Internal Server Error' 
    }
}
module.exports = errorHandler;
