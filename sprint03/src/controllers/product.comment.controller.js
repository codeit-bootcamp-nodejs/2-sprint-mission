import { db } from "../lib/db.js";
import { assert } from "superstruct";
import { CreateDto } from "../utils/dtos/comments.dto.js";

// 상품 댓글 목록
const getProductComments = async (req, res, next) => {
  try {
    const { cursor, limit = 10 } = req.query;

    const comments = await db.productComment.findMany({
      where: { productId: req.params.productid },
      skip: cursor ? 1 : 0,
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

// 상품에 댓글 등록
const createProductComment = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const newComment = await db.productComment.create({
      data: {
        content: req.body.content,
        product: {
          connect: { id: Number(req.params.productId) },
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

// 상품 댓글 수정
const updateProductComment = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const id = Number(req.params.commentId);

    const existingComment = await db.productComment.findUnique({
      where: { id },
    });
    if (!existingComment) {
      const error = new Error();
      error.status = 404;
      throw error;
    }

    const updateComment = await db.productComment.update({
      where: { id },
      data: { content: req.body.content },
    });
    res.status(200).json({
      massage: "댓글이 수정되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

// 상품 댓글 삭제
const deleteProductComment = async (req, res, next) => {
  try {
    const id = Number(req.params.commentId);

    const existingComment = await db.productComment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      const error = new Error();
      error.status = 404;
      throw error;
    }

    const deleteComment = await db.productComment.delete({ where: { id } });

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
