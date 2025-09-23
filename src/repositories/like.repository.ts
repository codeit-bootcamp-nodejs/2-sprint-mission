import { db } from "../utils/db";
import { ArticleWithUser } from "../types/article.types";
import { LikeResponseType, LikeParams } from "../types/like.types";
import { AuthenticationError, ValidationError } from "../utils/error";
import { ProductWithUser } from "../types/product.types";

export default class LikeRepository {
  /**
   * @description 사용자의 좋아요 목록 조회
   */
  static async getUserLikes({ userId, articles, products }: { userId: number, articles?: ArticleWithUser[], products?: ProductWithUser[] }) {
    if (!userId) throw new AuthenticationError();

    return await db.like.findMany({
      where: {
        userId,
        articleId: articles ? { in: articles.map(article => article.id) } : null,
        productId: products ? { in: products.map(product => product.id) } : null
      }
    });
  }
  /**
   * @description 사용자의 좋아요 상태 조회
   */
  static async getUserLike({ userId, relationId, relationType, }: LikeParams) {
    if (!userId) throw new AuthenticationError();
    if (!relationId || !relationType) throw new ValidationError("좋아요를 조회할 수 없습니다.");

    return await await db.like.findFirst({
      where: {
        articleId: relationType === 'articles' ? relationId : null,
        productId: relationType === 'products' ? relationId : null,
        userId
      }
    });
  }

  /**
   * @description 좋아요 추가
   *  
   */
  static async postUserLike({ userId, relationId, relationType, }: LikeParams) {
    if (!userId) throw new AuthenticationError();
    if (!relationId || !relationType) throw new ValidationError("좋아요를 조회할 수 없습니다.");

    return await db.like.create({
      data: {
        userId,
        articleId: relationType === 'articles' ? relationId : null,
        productId: relationType === 'products' ? relationId : null
      },
    });
  }

  /**
   * @description 좋아요 삭제
   */
  static async deleteUserLike({ isLiked }: { isLiked: LikeResponseType }) {
    return await db.like.delete({ where: { id: isLiked.id } });
  }


  /**
   * @description 좋아요한 상품 목록 조회 가능
   */
  static async getLikeProductByUser(userId: number) {
    return await db.like.findMany({
      where: {
        userId,
        productId: {
          not: null, // 상품에 대한 좋아요만 조회
        }
      },
      include: {
        product: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                image: true
              }
            }
          }
        },
      },
    });
  }

  /**
  * @description 좋아요한 게시글 목록 조회 가능
  */
  static async getLikeArticleByUser(userId: number) {
    return await db.like.findMany({
      where: {
        userId,
        articleId: {
          not: null, // 게시글에 대한 좋아요만 조회
        }
      },
      include: {
        article: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                image: true
              }
            }
          }
        },
      },
    });
  }

  /**
   * @description 상품에 좋아요한 유저 목록 조회
   */
  static async getProductLikes({ productId }: { productId: number }) {
    return await db.like.findMany({
      where: {
        productId
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true
          }
        }
      }
    });
  }
}