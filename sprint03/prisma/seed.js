import { db } from "../src/utils/db.js";

async function main() {
  // Product 데이터
  await db.product.createMany({
    data: [
      {
        name: "맥북 프로",
        description: "중고 모델입니다.",
        price: 1200000,
        stock: 5,
        tags: ["노트북", "애플"],
      },
      {
        name: "에어팟 프로",
        description: "신상 입니다.",
        price: 700000,
        stock: 10,
        tags: ["이어폰", "애플"],
      },
    ],
    skipDuplicates: true,
  });

  // Article 데이터
  await db.article.createMany({
    data: [
      {
        title: "1등",
        content: "내가 제일 처음으로 글 씀",
      },
      {
        title: "1등 놀이 애도 아니고",
        content: "그럼 난 2등 ㅋㅋ",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log("🌱 Seeding 완료!");
  })
  .catch((e) => {
    console.error("❌ Seeding 실패:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
