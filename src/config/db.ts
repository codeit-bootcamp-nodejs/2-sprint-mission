import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }, // NODE_ENV=test면 .env.test의 URL 사용
  },
});

export default db;
