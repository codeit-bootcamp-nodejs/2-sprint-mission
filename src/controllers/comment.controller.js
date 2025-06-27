const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 게시글 댓글 등록
exports.createArticleComment = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: parseInt(articleId),
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// 상품 댓글 등록
exports.createProductComment = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        productId: parseInt(productId),
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// 댓글 수정
exports.updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { content },
    });
    res.json(comment);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    }
    next(err);
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res, next) => {
  try {
    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    }
    next(err);
  }
};

// 게시글 댓글 목록 조회
exports.getArticleComments = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { cursor, take = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId) },
      orderBy: { id: 'asc' },
      take: parseInt(take),
      ...(cursor && {
        skip: 1,
        cursor: { id: parseInt(cursor) },
      }),
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// 상품 댓글 목록 조회
exports.getProductComments = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { cursor, take = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      orderBy: { id: 'asc' },
      take: parseInt(take),
      ...(cursor && {
        skip: 1,
        cursor: { id: parseInt(cursor) },
      }),
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};