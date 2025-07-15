// src/controllers/commentsController.ts
import { Request, Response } from 'express';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
  UpdateCommentBodyStruct,
} from '../structs/commentsStruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import * as commentService from '../services/comment.service'; // 실제 서비스 경로 확인 필요

// 댓글 생성
export async function createComment(req: Request, res: Response): Promise<Response> {
  const { id: articleId } = create(req.params, IdParamsStruct) as { id: number };
  const { content } = create(req.body, CreateCommentBodyStruct) as { content: string };

  const result = await commentService.createComment(articleId, content);
  return res.status(201).send(result);
}

// 댓글 목록 조회
export async function getCommentList(req: Request, res: Response): Promise<Response> {
  const { id: articleId } = create(req.params, IdParamsStruct) as { id: number };
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct) as {
    cursor: number | null;
    limit: number;
  };

  const result = await commentService.getCommentList(articleId, cursor, limit);
  return res.send(result);
}

// 댓글 수정
export async function updateComment(req: Request, res: Response): Promise<Response> {
  const { id } = create(req.params, IdParamsStruct) as { id: number };
  const { content } = create(req.body, UpdateCommentBodyStruct) as { content: string };

  const result = await commentService.updateComment(id, content);
  return res.send(result);
}

// 댓글 삭제
export async function deleteComment(req: Request, res: Response): Promise<Response> {
  const { id } = create(req.params, IdParamsStruct) as { id: number };
  await commentService.deleteComment(id);
  return res.status(204).send();
}
