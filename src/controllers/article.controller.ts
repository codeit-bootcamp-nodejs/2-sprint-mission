import { Request, Response } from "express";
import { getValidatedId } from "../utils/common";
import ArticleService from "../services/article.service";
import { ArticleListQueryDto, CreateArticleDto, UpdateArticleDto } from "../dtos/article.dto";
import { ArticleResponseType } from "../types/article.types";

export default class ArticleController {
  /**
   * @description 게시글 등록
   * @route POST /articles
   * 
   * @param {string} req.body.title - 게시글 제목
   * @param {string} req.body.content - 게시글 내용
   */
  static async postArticle(req: Request, res: Response) {
    const body: CreateArticleDto = req.body;
    const userId = req.user ? Number(req.user.id) : null;

    const newArticle: Partial<ArticleResponseType> = await ArticleService.postArticle({ body, userId });
    res.status(201).json({ newArticle, message: "게시글이 등록되었습니다." });
  };

  /**
   * @description 게시글 목록 조회
   * @route GET /articles
   *
   * @param {number} req.query.offset - 조회 시작 위치
   * @param {number} req.query.limit - 조회할 게시글 수
   * @param {string} req.query.order - 정렬 기준 (기본값: "recent", "asc" 또는 "desc")
   * @param {string} req.query.search - 검색어 (게시글 제목 또는 내용에 포함된 경우)
   */
  static async getArticle(req: Request, res: Response) {
    const query: ArticleListQueryDto = req.query;
    const userId = req.user ? Number(req.user.id) : null;

    const formattedArticles: ArticleResponseType[] = await ArticleService.getArticle({ query, userId });
    res.status(200).json(formattedArticles);
  };

  /** 
   * @description 게시글 ID로 상세 조회
   * @route GET /articles/:id
   * 
   * @param {string} req.params.id - 게시글 ID
   */
  static async getArticleById(req: Request, res: Response) {
    const articleId = getValidatedId(req.validatedId!);
    const userId = req.user ? Number(req.user.id) : null;

    const formattedArticle: ArticleResponseType = await ArticleService.getArticleById({ articleId, userId });
    res.status(200).json(formattedArticle);
  };

  /**
   * @description 게시글 정보 수정
   * @route PATCH /articles/:id
   * 
   * @param {string} req.params.id - 게시글 ID
   * @param {string} req.body.title - 게시글 제목
   * @param {string} req.body.content - 게시글 내용
   */
  static async patchArticle(req: Request, res: Response) {
    const body: UpdateArticleDto = req.body;
    const articleId = getValidatedId(req.validatedId!);
    const userId = req.user ? Number(req.user.id) : null;

    const updateArticle: Partial<ArticleResponseType> = await ArticleService.patchArticle({ body, articleId, userId });
    res.status(200).json(updateArticle);
  };

  /**
   * @description 게시글 삭제
   * @route DELETE /articles/:id
   * 
   * @param {string} req.params.id - 게시글 ID
   */
  static async deleteArticle(req: Request, res: Response) {
    const articleId = getValidatedId(req.validatedId!);
    const userId = req.user ? Number(req.user.id) : null;

    await ArticleService.deleteArticle({ articleId, userId });
    res.status(204).json({ message: "게시글이 삭제되었습니다." });
  };
}



