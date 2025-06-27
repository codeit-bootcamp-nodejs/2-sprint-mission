const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 게시글 등록
exports.createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// 게시글 상세 조회
exports.getArticle = async (req, res, next) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!article) return res.status(404).json({ message: '게시글이 없습니다.' });
    res.json(article);
  } catch (err) {
    next(err);
  }
};

// 게시글 목록 조회 (+ 검색 + 페이지네이션)
exports.getArticles = async (req, res, next) => {
  try {
    const { page = 1, take = 10, keyword = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(take);

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(take),
    });

    res.json(articles);
  } catch (err) {
    next(err);
  }
};

// 게시글 수정
exports.updateArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content },
    });
    res.json(article);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: '수정할 게시글이 없습니다.' });
    }
    next(err);
  }
};

// 게시글 삭제
exports.deleteArticle = async (req, res, next) => {
  try {
    await prisma.article.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: '삭제할 게시글이 없습니다.' });
    }
    next(err);
  }
};