import { prismaClient } from '../src/lib/prismaClient.js';


async function main() {
  try {
    await prismaClient.$connect();
    console.log('DB 연결 성공!');
  } catch (err) {
    console.error('DB 연결 실패:', err);
  } finally {
    await prismaClient.$disconnect();
  }
}

main();
