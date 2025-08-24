// src/controllers/commentsController.ts
import { Request, Response } from 'express';
import { assertHasUser } from '../utils/assertHasUser';
import * as commentsRepo from '../repositories/commentsRepository';
import * as notificationsRepo from '../repositories/notificationsRepository';
import { emitToUser } from '../lib/notify';

export async function createComment(req: Request, res: Response) {
  assertHasUser(req);

  const { articleId, content } = req.body as { articleId: number; content: string };
  if (!Number.isInteger(articleId) || articleId <= 0) {
    return res.status(400).json({ message: 'INVALID_ARTICLE_ID' });
  }
  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'INVALID_CONTENT' });
  }

  // 1) 댓글 저장 (레포 직접 호출: 프로젝트마다 서비스 시그니처가 달라 에러가 났었음)
  const newComment = await commentsRepo.createComment({
    articleId,
    userId: req.user.id,
    content: content.trim(),
    // 필요시 productId: null 등 모델에 맞춰 추가
  } as any);

  // 2) 알림: 원글 작성자에게 insert + emit
  try {
    let ownerId: number | undefined;
    if (ownerId && ownerId !== req.user.id) {
      const noti = await notificationsRepo.create({
        userId: ownerId,
        type: 'NEW_COMMENT',
        title: '새 댓글이 달렸어요',
        entityType: 'ARTICLE',
        entityId: articleId,
        isRead: false,
      } as any);

      // req.app 타입 미스매치 해결용: any 캐스팅
      emitToUser(req.app as any, ownerId, 'notification:new', {
        id: noti.id,
        title: noti.title,
        type: 'NEW_COMMENT',
        entityType: 'ARTICLE',
        entityId: articleId,
        isRead: noti.isRead,
        createdAt: (noti as any).createdAt?.toISOString?.(),
      });
    }
  } catch (e) {
    console.error('[notify] NEW_COMMENT failed:', e);
  }

  res.status(201).json(newComment);
}
