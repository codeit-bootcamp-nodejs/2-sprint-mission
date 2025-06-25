const dotenv = require('dotenv');

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

module.exports = { ACCESS_SECRET, REFRESH_SECRET };
