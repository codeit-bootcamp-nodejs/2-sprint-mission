var Prisma = require('@prisma/client');

var db = new Prisma.PrismaClient();

module.exports = { db };
