import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto, UpdateArticleDto } from '../dtos/article.dto';

// 게시글 생성
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = CreateArticleDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const article = await ArticleService.createArticle({
      ...parsed.data,
      authorId: req.user!.id,
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// 게시글 단건 조회
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid article id' });
    }

    const currentUserId = req.user?.id;
    const article = await ArticleService.getArticleById(id, currentUserId);
    if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    return res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

// 게시글 전체 목록 조회
export const getArticleList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset = '0', limit = '10', search = '' } = req.query as {
      offset?: string;
      limit?: string;
      search?: string;
    };

    const articles = await ArticleService.getArticleList(
      parseInt(offset),
      parseInt(limit),
      search
    );

    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

// 게시글 수정
export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = UpdateArticleDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const id = parseInt(req.params.id);
    const updated = await ArticleService.updateArticle(id, parsed.data);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// 게시글 삭제
export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    await ArticleService.deleteArticle(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 게시글 좋아요
export const likeArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = parseInt(req.params.id);
    const userId = req.user!.id;

    await ArticleService.likeArticle(userId, articleId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// 게시글 좋아요 취소
export const unlikeArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = parseInt(req.params.id);
    const userId = req.user!.id;

    await ArticleService.unlikeArticle(userId, articleId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// 게시글 좋아요 목록 조회
export const getArticleLikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = parseInt(req.params.articleId);
    const likes = await ArticleService.getArticleLikes(articleId);
    res.status(200).json(likes);
  } catch (err) {
    next(err);
  }
};
