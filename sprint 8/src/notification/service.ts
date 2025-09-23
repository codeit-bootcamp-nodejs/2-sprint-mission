import { NotificationType, type Notification } from '@prisma/client';
import type { Server } from 'socket.io';
import NotificationRepository, { ListOptions } from './repository';

export default class NotificationService {
  constructor(private repo: NotificationRepository, private io?: Server) {}

  private emitToUser(userId: number, event: string, payload: unknown): void {
    this.io?.to(`user:${userId}`).emit(event, payload);
  }

  async create(params: {
    userId: number; actorId?: number;
    type: NotificationType;
    productId?: number; articleId?: number;
    message: string;
  }): Promise<Notification> {
    const saved = await this.repo.create(params);
    // 실시간 푸시
    this.emitToUser(saved.userId, 'notification:new', saved);
    const unread = await this.repo.countUnread(saved.userId);
    this.emitToUser(saved.userId, 'notification:count', unread);
    return saved;
  }

  list(userId: number, opts: ListOptions = {}): Promise<Notification[]> {
    const take = Math.min(Math.max(opts.take ?? 20, 1), 100);
    return this.repo.list(userId, { ...opts, take });
  }

  countUnread(userId: number): Promise<number> {
    return this.repo.countUnread(userId);
  }

  async markRead(id: number, userId: number): Promise<{ ok: true }> {
    await this.repo.markRead(id, userId);
    const unread = await this.repo.countUnread(userId);
    this.emitToUser(userId, 'notification:count', unread);
    return { ok: true };
  }

  async markAllRead(userId: number): Promise<{ ok: true }> {
    await this.repo.markAllRead(userId);
    const unread = await this.repo.countUnread(userId);
    this.emitToUser(userId, 'notification:count', unread);
    return { ok: true };
  }

  // ────────────────────── 트리거 연결용 편의 메서드 ──────────────────────

  /** 가격 변동 트리거: 상품 좋아요한 유저들에게 알림 전송 */
  async notifyPriceChanged(params: {
    productId: number;
    oldPrice: number;
    newPrice: number;
    likerUserIds: number[];      // ProductService에서 조회해 전달
    productName?: string;
  }): Promise<void> {
    const { productId, oldPrice, newPrice, likerUserIds, productName } = params;
    if (oldPrice === newPrice || !likerUserIds.length) return;

    const msg =
      (productName ? `관심 상품 "${productName}" ` : '관심 상품 ') +
      `가격이 ${oldPrice} → ${newPrice} 로 변경되었습니다.`;

    await Promise.all(
      likerUserIds.map((userId) =>
        this.create({
          userId,
          type: NotificationType.PRICE_CHANGED,
          productId,
          message: msg,
        })
      )
    );
  }

  /** 댓글 등록 트리거: 글 작성자에게 알림 전송 (자기 댓글이면 발송 안 함) */
  async notifyCommentAdded(params: {
    articleId: number;
    authorUserId: number;
    commenterId: number;
    commentContent: string;
    articleTitle?: string;
  }): Promise<void> {
    const { articleId, authorUserId, commenterId, commentContent, articleTitle } = params;
    if (authorUserId === commenterId) return;

    const snippet = commentContent.length > 60 ? commentContent.slice(0, 60) + '…' : commentContent;
    const msg =
      (articleTitle ? `게시글 "${articleTitle}"` : '내 게시글') +
      `에 새 댓글: ${snippet}`;

    await this.create({
      userId: authorUserId,
      actorId: commenterId,
      type: NotificationType.COMMENT_ADDED,
      articleId,
      message: msg,
    });
  }
}
