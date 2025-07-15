// src/repositories/comment.repository.ts
import { prismaClient } from '../lib/prismaClient';

interface CreateCommentInput {
  articleId: number;
  content: string;
}

interface UpdateCommentInput {
  content: string;
}

interface FindAllCommentsParams {
  articleId: number;
  cursor: string | null;
  limit: number;
}

// 댓글 생성
export const create = ({ articleId, content }: CreateCommentInput) => {
  return prismaClient.comment.create({
    data: {
      articleId,
      content,
    },
  });
};

// 댓글 하나 조회
export const findById = (id: number) => {
  return prismaClient.comment.findUnique({ where: { id } });
};

// 댓글 수정
export const update = (id: number, data: UpdateCommentInput) => {
  return prismaClient.comment.update({ where: { id }, data });
};

// 댓글 삭제
export const deleteComment = (id: number) => {
  return prismaClient.comment.delete({ where: { id } });
};

// 댓글 목록 조회 (Cursor 기반)
export const findAll = ({ articleId, cursor, limit }: FindAllCommentsParams) => {
  return prismaClient.comment.findMany({
    where: { articleId },
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: Number(cursor) } }),
    orderBy: { id: 'asc' },
  });
};
