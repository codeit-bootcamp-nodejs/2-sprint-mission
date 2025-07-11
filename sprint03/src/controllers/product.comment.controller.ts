import { assert } from "superstruct";
import { CreateDto, CommentCreateDto, CommentUpdateDto } from "../utils/dtos/comments.dto";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";
import { CommentService } from "../services/comment.service";

// 상품 댓글 목록
const getProductComments: RequestHandler = async (req, res, next) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const productId = Number(req.params.productid);

    const { comments, nextCursor } = await CommentService.getProductComments(
      productId,
      cursor ? Number(cursor) : undefined,
      Number(limit)
    );

    res.status(200).json({
      message: "댓글 목록 조회 성공",
      comments,
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
};

// 상품에 댓글 등록
const createProductComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const newComment = await CommentService.createProductComment(
      Number(req.params.productId),
      req.user.id,
      req.body as CommentCreateDto
    );

    res.status(201).json({
      message: "댓글이 등록되었습니다.",
      commentid: newComment.id,
    });
  } catch (err) {
    next(err);
  }
};

// 상품 댓글 수정
const updateProductComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const id = Number(req.params.commentId);

    await CommentService.updateProductComment(
      id,
      req.body as CommentUpdateDto
    );

    res.status(200).json({
      message: "댓글이 수정되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

// 상품 댓글 삭제
const deleteProductComment: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.commentId);

    await CommentService.deleteProductComment(id);

    res.status(200).json({
      message: "댓글이 삭제되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

export {
  createProductComment,
  getProductComments,
  updateProductComment,
  deleteProductComment,
};
