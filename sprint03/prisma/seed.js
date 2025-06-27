import { db } from "../src/lib/db.js";
import { hashPassword } from "../src/utils/hash-password.js";

async function main() {
  const hashedPassword01 = await hashPassword("password123");
  const hashedPassword02 = await hashPassword("password456");

  const user1 = await db.user.create({
    data: {
      email: "test123@test.com",
      nickname: "tester01",
      password: hashedPassword01,
    },
  });

  const user2 = await db.user.create({
    data: {
      email: "test456@test.com",
      nickname: "tester02",
      password: hashedPassword02,
    },
  });

  // Product (user1)
  const product = await db.product.create({
    data: {
      name: "맥북 프로",
      description: "중고 모델입니다.",
      price: 1200000,
      stock: 5,
      tags: ["노트북", "애플"],
      userId: user1.id,
    },
  });

  // 3) ProductComment (user2)
  const productComment = await db.productComment.create({
    data: {
      content: "이거 삽니다",
      productId: product.id,
      userId: user2.id,
    },
  });

  // 4) Article (user2)
  const article = await db.article.create({
    data: {
      title: "User2 의 첫 글",
      content: "안녕하세요, User2 입니다.",
      userId: user2.id,
    },
  });

  // 5) ArticleComment (user1)
  const articleComment = await db.articleComment.create({
    data: {
      content: "안녕하세요! 반갑습니다.",
      articleId: article.id,
      userId: user1.id,
    },
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
