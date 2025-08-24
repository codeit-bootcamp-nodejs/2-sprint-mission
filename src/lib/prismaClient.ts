import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export const prismaClient = prisma;