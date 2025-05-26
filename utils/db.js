var Prisma = require("../generated/prisma");

var db = new Prisma.PrismaClient();

module.exports = { db };