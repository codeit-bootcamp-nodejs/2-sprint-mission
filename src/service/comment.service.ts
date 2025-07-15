// src/services/comment.service.ts
import { commentRepository } from '../repositories/comment.repository';
import { articleRepository } from '../repositories/article.repository';
import NotFoundError from '../lib/errors/NotFoundError';

// 댓글 생성
export const createComment = async (
  articleId: number,
  content: string
): Promise<{ id: number; content: string; createdAt: Date; articleId: number }> => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw new NotFoundError('article', articleId);

  const comment = await commentRepository.create({ articleId, content });
  return comment;
};

// 댓글 목록 조회
export const getCommentList = async (
  articleId: number,
  cursor: string | null,
  limit: number
): Promise<any[]> => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw new NotFoundError('article', articleId);

  const comments = await commentRepository.findAll({ articleId, cursor, limit });
  return comments;
};

// 댓글 수정
export const updateComment = async (
  id: number,
  content: string
): Promise<{ id: number; content: string; updatedAt: Date }> => {
  const comment = await commentRepository.findById(id);
  if (!comment) throw new NotFoundError('comment', id);

  const updatedComment = await commentRepository.update(id, { content });
  return updatedComment;
};

// 댓글 삭제
export const deleteComment = async (id: number): Promise<void> => {
  const comment = await commentRepository.findById(id);
  if (!comment) throw new NotFoundError('comment', id);

  await commentRepository.delete(id);
};
