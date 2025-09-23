import { db } from "../utils/db";
import { CommentListQueryDto } from "../dtos/comment.dto";
import { CommentParamType } from "../types/comment.type";

export class CommentRepository {
  /**
   * @description 게시글 댓글 등록
   */
  static async postArticleComment({ content, relationId, userId }: CommentParamType) {
    return await db.comment.create({
      data: {
        content,
        articleId: relationId,
        userId: userId
      }
    });
  }

  /**
   * @description 상품 댓글 등록
   */
  static async postProductComment({ content, relationId, userId }: CommentParamType) {
    return await db.comment.create({
      data: {
        content,
        productId: relationId,
        userId: userId
      }
    });
  }

  /** 
   * @description 댓글 존재 여부 확인
   */ 
  static async findComment(commentId: number) {
    return await db.comment.findUnique({
      where: { id: commentId },
      include: { user: true }
    });
  }

  /**
   * @description 게시글 댓글 조회
   */
  static async getArticleComments(commentDto: CommentListQueryDto) {
    const { relationId, cursor, take } = commentDto;

    return await db.comment.findMany({
      where: { articleId: relationId },
      take: Number(take),
      ...(cursor && { skip: 1, cursor: { id: Number(cursor) } }),
      select: { id: true, content: true, createdAt: true },
    });
  }


  /**
   * @description 상품 댓글 조회
   */
  static async getProductComments(commentDto: CommentListQueryDto) {
    const { relationId, cursor, take } = commentDto;

    return await db.comment.findMany({
      where: { productId: relationId },
      take: Number(take),
      ...(cursor && { skip: 1, cursor: { id: Number(cursor) } }),
      select: { id: true, content: true, createdAt: true },
    });
  }

  /**
   * @description 댓글 수정
   */
  static async patchComment(commentId: number, content: string) {
    return await db.comment.update({
      where: { id: commentId },
      data: { content }
    });
  }

  /**
   * @description 댓글 삭제
   */
  static async deleteComment(commentId: number) {
    return await db.comment.delete({ 
      where: { id: commentId } 
    });
  }

}
