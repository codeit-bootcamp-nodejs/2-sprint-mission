function errorHandler(err, req, res, next) {
    console.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // 명확한 메시지를 포함해서 반환
    switch (statusCode) {
        case 400:
            return res.status(400).json({ error: message || 'Bad Request' });
        case 401:
            return res.status(401).json({ error: message || 'Unauthorized' });
        case 403:
            return res.status(403).json({ error: message || 'Forbidden' });
        case 404:
            return res.status(404).json({ error: message || 'Not Found' });
        default:
            return res.status(statusCode).json({ error: message });
    }
}

module.exports = errorHandler;
