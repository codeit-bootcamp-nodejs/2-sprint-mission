const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = require('../lib/constants');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authrization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1]; // 'Bearer TOKEN'
    jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = { id: decoded.userId };
        next();
    });
};
