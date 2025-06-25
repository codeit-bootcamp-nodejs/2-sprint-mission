import { db } from "../utils/db.js";
import { assert } from "superstruct";
import { CreateDto } from "../dtos/comments.dto.js";

// 게시글 댓글 목록
const getArticleComments = async (req, res, next) => {
  try {
    const { cursor, limit = 10 } = req.query;

    const comments = await db.articleComment.findMany({
      where: { articleId: req.params.articleid },
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
const createArticleComment = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const newComment = await db.articleComment.create({
      data: {
        content: req.body.content,
        article: { connect: { id: Number(req.params.articleId) } },
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
const updateArticleComment = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const id = Number(req.params.commentId);

    const existingComment = await db.articleComment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      const error = new Error();
      error.status = 404;
      throw error;
    }

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
const deleteArticleComment = async (req, res, next) => {
  try {
    const id = Number(req.params.commentId);

    const existingComment = await db.articleComment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      const error = new Error();
      error.status = 404;
      throw error;
    }

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
