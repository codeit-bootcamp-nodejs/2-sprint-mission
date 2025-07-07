import { db } from "../lib/db";
import { assert } from "superstruct";
import { CreateDto } from "../utils/dtos/comments.dto";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";


// 게시글 댓글 목록
const getArticleComments: RequestHandler = async (req, res, next) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const articleId = Number(req.params.articleid)

    const comments = await db.articleComment.findMany({
      where: { articleId },
      skip: cursor ? 1 : 0, // 현재 페이지 스킵
      cursor: cursor ? { id: Number(cursor) } : undefined,
      take: Number(limit),
      orderBy: { id: "asc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    const nextCursor =
      comments.length === Number(limit)
        ? comments[comments.length - 1].id
        : null;

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
    const id = Number(req.params.articleId)

    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");

    const newComment = await db.articleComment.create({
      data: {
        content: req.body.content,
        article: {
          connect: { id },
        },
        user: {
          connect: { id: req.user.id },
        },
      },
    });

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

    const existingComment = await db.articleComment.findUnique({
      where: { id },
    });

    if (!existingComment) throw new HttpError(404); 
    
    const updateComment = await db.articleComment.update({
      where: { id },
      data: { content: req.body.content },
    });
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

    const existingComment = await db.articleComment.findUnique({
      where: { id },
    });

    if (!existingComment) throw new HttpError(404); 

    const deleteComment = await db.articleComment.delete({ where: { id } });

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
