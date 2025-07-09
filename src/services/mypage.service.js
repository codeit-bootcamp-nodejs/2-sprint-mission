const bcrypt = require("bcrypt");
const { db } = require("../config/db");

// 내 정보 조회
exports.getMyInfo = async (userId) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
    },
  });
  return user;
};

// 내 정보 수정
exports.updateMyInfo = async (userId, data) => {
  const updated = await db.user.update({
    where: { id: userId },
    data: {
      nickname: data.nickname,
      imageUrl: data.imageUrl,
    },
    select: {
      nickname: true,
      image: true,
    },
  });
  return updated;
};

// 비밀번호 변경
exports.updateMyPw = async (userId, currentPassword, newPassword) => {
  const user = await db.user.findUnique({ where: { id: userId } });

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    const error = new Error("현재 비밀번호 일치하지 않음");
    error.status = 403;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  return await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

// 내가 등록한 상품 목록 조회
exports.getMyProducts = async (userId) => {
  const products = await db.product.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
  });

  return products;
};

// 내가 작성한 게시글 목록 조회
exports.getMyArticles = async (userId) => {
  const articles = await db.article.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
  });
  return articles;
};

// 내가 작성한 댓글 목록 조회
exports.getMyComments = async (userId) => {
  const productComments = await db.productComment.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
  });

  const articleComments = await db.articleComment.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
  });
  return { productComments, articleComments };
};

// 내가 좋아요 한 상품 목록 조회
exports.getLikedProducts = async (userId) => {
  const likes = await db.productLike.findMany({
    where: { userId: Number(userId) },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return likes.map((like) => like.product);
};

// 내가 좋아요 한 게시글 목록 조회
exports.getLikedArticles = async (userId) => {
  const likes = await db.articleLike.findMany({
    where: { userId: Number(userId) },
    include: {
      article: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return likes.map((like) => like.article);
};
