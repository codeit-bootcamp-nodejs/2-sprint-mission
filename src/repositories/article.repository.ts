import { db } from "../utils/db";
import { ArticlePagination } from "../types/article.types";
import { CreateArticleDto, UpdateArticleDto } from "../dtos/article.dto";

export default class ArticleRepository {
  /**
   * @description 게시글 등록
   */
  static async postArticle(body: CreateArticleDto, userId: number) {
    return await db.article.create({ data: { ...body, userId } });
  };

  /**
   * @description 게시글 목록 조회
   * 
   */
  static async getArticle({ where, order, skip, take }: ArticlePagination) {
    return await db.article.findMany({
      where,
      orderBy: order === "recent" ? { createdAt: "desc" } : { createdAt: "asc" },
      skip,
      take,
      include: {
        user: {
          select: { id: true, nickname: true, image: true } // 작성자 정보 포함
        },
        _count: {
          select: { isLiked: true } // 좋아요 수 포함
        }
      }
    });
  }

  /** 
   * @description 게시글 ID로 상세 조회
   */
  static async getArticleById(articleId: number) {
    return await db.article.findUnique({
      where: { id: articleId },
      include: {
        user: {
          select: { id: true, nickname: true, image: true } // 작성자 정보 포함
        },
        _count: {
          select: { isLiked: true } // 좋아요 수 포함
        }
      }
    });

  }

  /**
   * @description 게시글 정보 수정
   */
  static async patchArticle({ articleId, body }: { articleId: number, body: UpdateArticleDto }) {
    return await db.article.update({
      where: { id: articleId },
      data: { ...body, updatedAt: new Date() }
    });
  }

  /**
  * @description 게시글 삭제
  */
  static async deleteArticle(articleId: number) {
    await db.article.delete({ where: { id: articleId } });
  }
  /**
   * @description 자신이 등록한 게시글 목록 조회
   */
  static async getArticleByUser(userId: number) {
    return await db.article.findMany({
      where: {
        userId
      }
    });
  }

  /**
   * @description 게시글 id로 작성자 조회
   */
  static async getArticleAuthor(articleId: number) {
    return await db.article.findUnique({
      where: { id: articleId },
      select: { user: true }
    });
  }
}
