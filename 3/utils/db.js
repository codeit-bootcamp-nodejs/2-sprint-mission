const prisma = require('../generated/client/index.js');
const db = new prisma.PrismaClient();

module.exports = db;