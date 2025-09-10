import Prisma from "@prisma/client";

const db = new Prisma.PrismaClient();

export { db };