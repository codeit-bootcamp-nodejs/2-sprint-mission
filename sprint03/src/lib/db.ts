import { PrismaClient } from "../../generated/prisma/index";

const db = new PrismaClient();

export { db };
