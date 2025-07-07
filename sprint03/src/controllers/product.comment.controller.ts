import { db } from "../lib/db";
import { assert } from "superstruct";
import { CreateDto } from "../utils/dtos/comments.dto";
import { RequestHandler } from "express";
import HttpError from "../types/httpError";


// 상품 댓글 목록
const getProductComments: RequestHandler = async (req, res, next) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const productId = Number(req.params.productid)

    const comments = await db.productComment.findMany({
      where: { productId },
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
const createProductComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    if (!req.user) throw new HttpError(401, "인증이 필요합니다.");
    
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
const updateProductComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, CreateDto);
    const id = Number(req.params.commentId);

    const existingComment = await db.productComment.findUnique({
      where: { id },
    });

    if (!existingComment) throw new HttpError(404);

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
const deleteProductComment: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.commentId);

    const existingComment = await db.productComment.findUnique({
      where: { id },
    });

    if (!existingComment) throw new HttpError(404);

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
