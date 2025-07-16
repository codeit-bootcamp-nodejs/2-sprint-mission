import { assert } from "superstruct";
import { CreateDto, CommentCreateDto, CommentUpdateDto } from "../utils/dtos/comments.dto";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";
import { CommentService } from "../services/comment.service";

// 게시글 댓글 목록
const getArticleComments: RequestHandler = async (req, res, next) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const articleId = Number(req.params.articleid);

    const { comments, nextCursor } = await CommentService.getArticleComments(
      articleId,
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

// 게시글에 댓글 달기
const createArticleComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const articleId = Number(req.params.articleId);

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const newComment = await CommentService.createArticleComment(
      articleId,
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

// 게시글 댓글 수정
const updateArticleComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const id = Number(req.params.commentId);

    await CommentService.updateArticleComment(
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

// 게시글 댓글 삭제
const deleteArticleComment: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.commentId);

    await CommentService.deleteArticleComment(id);

    res.status(200).json({
      message: "댓글이 삭제되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

export {
  createArticleComment,
  getArticleComments,
  updateArticleComment,
  deleteArticleComment,
};
