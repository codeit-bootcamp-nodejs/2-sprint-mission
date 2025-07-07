import { db } from "../lib/db";
import { assert } from "superstruct";
import { CreateDto } from "../utils/dtos/articles.dto";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";


// 게시글 목록
const getArticles: RequestHandler = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sort = "recent" } = req.query;

    const search = String(req.query.search || "");

    const skip = (Number(page) - 1) * Number(pageSize); // 이전 페이지들 스킵
    const take = Number(pageSize);

    const where: any = {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    };

    const articles = await db.article.findMany({
      where,
      orderBy: sort === "recent" ? { id: "desc" } : undefined,
      skip,
      take,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: "게시글 목록 조회 성공",
      page: Number(page),
      pageSize: Number(pageSize),
      articles,
    });
  } catch (err) {
    next(err);
  }
};

// 게시글 작성
const createArticle: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const { title, content } = req.body;
    
  if (!req.user) throw new HttpError(401, "인증이 필요합니다.");
    
    const newProduct = await db.article.create({
      data: { title, content, userId: req.user.id },
    });

    res.status(200).json({
      message: "게시글이 등록되었습니다.",
      productId: newProduct.id,
    });
  } catch (err) {
    next(err);
  }
};

// 게시글 단일 조회
const getArticleById: RequestHandler = async (req, res, next) => {
  try {
    const articleId = Number(req.params.id);

  if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const userId = req.user.id;

    const article = await db.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!article) throw new HttpError(404); 

    let isLiked = false;

    if (userId) {
      const like = await db.articleLike.findUnique({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
      });

      isLiked = !!like;
    }
    res.status(200).json({ article, isLiked });
  } catch (err) {
    next(err);
  }
};

// 게시글 수정
const updateArticle: RequestHandler = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const id = Number(req.params.id);

    const article = await db.article.findUnique({ where: { id } });

    if (!article) throw new HttpError(404); 

    const updateData: Partial<typeof article> = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const updatedArticle = await db.article.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      message: "게시글이 수정되었습니다.",
      article: updatedArticle,
    });
  } catch (err) {
    next(err);
  }
};

// 게시글 삭제
const deleteArticle: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const article = await db.article.findUnique({ where: { id } });

    if (!article) throw new HttpError(404); 

    await db.article.delete({ where: { id } });

    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

// 게시글 좋아요 추가, 삭제
const articleLike: RequestHandler = async (req, res, next) => {
  try {

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");
    
    const userId = req.user.id;
    const articleId = Number(req.params.id);

    const existingLike = await db.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (existingLike) {
      await db.articleLike.delete({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
      });

      res.status(200).json({
        message: "좋아요 취소 완료!",
        liked: false,
        userId,
        articleId,
      });
    } else {
      await db.articleLike.create({
        data: {
          userId,
          articleId,
        },
      });

      res.status(201).json({
        message: "좋아요 완료!",
        liked: true,
        userId,
        articleId,
      });
    }
  } catch (err) {
    next(err);
  }
}

export {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
  articleLike,
};
