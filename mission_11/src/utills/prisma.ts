import { PrismaClient } from '@prisma/client';
import * as prismaTypes from '@prisma/client';
const prisma = new PrismaClient();

export default prisma;
export { prismaTypes };