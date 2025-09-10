import { db } from "../lib/db";
import { assert } from "superstruct";
import { CreateDto, ArticleCreateDto, ArticleUpdateDto } from "../utils/dtos/articles.dto";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";
import { ArticleService } from "../services/article.service";

// 게시글 목록
const getArticles: RequestHandler = async (req, res, next) => {
  try {
    const result = await ArticleService.getArticles(req.query);
    res.status(200).json({
      message: "게시글 목록 조회 성공",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// 게시글 작성
const createArticle: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const { title, content } = req.body as ArticleCreateDto;

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const newArticle = await ArticleService.createArticle(
      { title, content },
      req.user.id
    );

    res.status(200).json({
      message: "게시글이 등록되었습니다.",
      articleId: newArticle.id,
    });
  } catch (err) {
    next(err);
  }
};

// 게시글 단일 조회
const getArticleById: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const { article, isLiked } = await ArticleService.getArticleById(
      Number(req.params.id),
      req.user.id
    );

    res.status(200).json({ article, isLiked });
  } catch (err) {
    next(err);
  }
};

// 게시글 수정
const updateArticle: RequestHandler = async (req, res, next) => {
  try {
    const { title, content } =
      req.body as ArticleUpdateDto;

    const updatedArticle = await ArticleService.updateArticle(
      Number(req.params.id),
      { title, content }
    );

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
    await ArticleService.deleteArticle(Number(req.params.id));
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

// 게시글 좋아요 추가, 삭제
const articleLike: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const result = await ArticleService.toggleArticleLike(
      req.user.id,
      Number(req.params.id)
    );

    res.status(result.liked ? 201 : 200).json(result);
  } catch (err) {
    next(err);
  }
};

export {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
  articleLike,
};
