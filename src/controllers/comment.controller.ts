import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
import { CommentListQueryDto } from "../dtos/comment.dto";
import { getValidatedId } from "../utils/common";


export default class CommentController {
  /**
   * @description 게시글 댓글 등록
   * @route POST /articles/:id/comments
   * 
   * @param {string} req.params.relationId - 게시글 ID
   * @param {string} req.body.content - 댓글 내용
  */
  static async postArticleComment(req: Request, res: Response) {
    const { content } = req.body;
    const relationId = getValidatedId(req.validatedId!);
    const userId = req.user ? req.user.id : null;

    // 게시글이 존재하는 경우 댓글 등록
    const comment = await CommentService.postArticleComment({
      content,
      relationId,
      userId
    });
    res.status(201).json({ comment, message: "댓글이 등록되었습니다." });

  }

  /**
   * @description 상품 댓글 등록
   * @route POST /products/:id/comments
   * 
   * @param {string} req.params.id - 상품 ID
   * @param {string} req.body.content - 댓글 내용
   */
  static async postProductComment(req: Request, res: Response) {
    const { content } = req.body;
    const relationId = getValidatedId(req.validatedId!);
    const userId = req.user ? req.user.id : null;

    // 상품이 존재하는 경우 댓글 등록
    const comment = await CommentService.postProductComment({ content, relationId, userId });

    res.status(201).json({ comment, message: "댓글이 등록되었습니다." });
  }

  /**
   * @description 게시글 댓글 조회
   * @route GET /articles/:id/comments
   * 
   * @param {number} req.params.relationId - 게시글 ID
   * @param {Object} req.query.cursor - 페이지네이션을 위한 커서
   * @param {number} req.query.take - 조회할 댓글 수 (기본값: 10)
   * 
   */
  static async getArticleComments(req: Request, res: Response) {
    const commentDto: CommentListQueryDto = {
      cursor: req.params.cursor ? Number(req.params.cursor) : null,
      take: req.params.take ? Number(req.params.take) : 10,
      relationId: getValidatedId(req.validatedId!)
    }

    // 게시글이 존재하는 경우 댓글 조회
    const comments = await CommentService.getArticleComments(commentDto);
    res.status(200).json({ comments });
  }

  /**
   * @description 상품 댓글 조회
   * @route GET /products/:id/comments
   * 
   * @param {string} req.params.relationId - 게시글 ID
   * @param {Object} req.query.cursor - 페이지네이션을 위한 커서
   * @param {number} req.query.take - 조회할 댓글 수 (기본값: 10)
   */
  static async getProductComments(req: Request, res: Response) {
    const commentDto: CommentListQueryDto = {
      cursor: req.params.cursor ? Number(req.params.cursor) : null,
      take: req.params.take ? Number(req.params.take) : 10,
      relationId: getValidatedId(req.validatedId!)
    }

    // 상품이 존재하는 경우 댓글 조회
    const comments = await CommentService.getProductComments(commentDto);
    res.status(200).json({ comments });
  }

  /**
   * @description 댓글 수정
   * @route PATCH :commetType/:id/comments/:commentId
   * 
   * @param {string} req.params.id - 댓글 ID
   * @param {string} req.body.content - 수정할 댓글 내용
   */
  static async patchComment(req: Request, res: Response) {
    const { content } = req.body;
    const userId = req.user ? req.user.id : null;
    const commentId = getValidatedId(req.validatedId!);

    // 댓글이 존재하는 경우 수정
    const updatedComment = await CommentService.patchComment({
      content,
      userId,
      commentId
    });
    res.status(200).json({ updatedComment, message: "댓글이 수정되었습니다." });

  }
  /**
   * @description 댓글 삭제
   * @route DELETE :commetType/:id/comments/:id
   * 
   * @param {string} req.params.id - 삭제할 댓글 ID
   */
  static async deleteComment(req: Request, res: Response) {
    const commentId = getValidatedId(req.validatedId!);
    const userId = req.user ? req.user.id : null;

    // 댓글이 존재하는 경우 삭제
    await CommentService.deleteComment({ userId, commentId });
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  }

}