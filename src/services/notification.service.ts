import notificationRepository from "../repositories/notification.repository";
import { emitNotification, emitUnreadCount } from "../sockets";

type ListQuery = { page: number; size: number; isRead?: boolean };

type CreateInput = {
  userId: number;
  type: "PRICE_CHANGE" | "ARTICLE_COMMENT" | "PRODUCT_COMMENT";
  title: string;
  message?: string;
  meta?: any;
};

const notificationService = {
  // 알림 리스트 조회
  list: async (userId: number, { page, size, isRead }: ListQuery) => {
    return notificationRepository.findMany(userId, { page, size, isRead });
  },

  // 미읽음 갯수
  unreadCount: async (userId: number) => {
    return notificationRepository.countUnread(userId);
  },

  // 읽음 처리
  read: async (
    userId: number,
    { ids, all }: { ids?: number[]; all?: boolean }
  ) => {
    await notificationRepository.markRead(userId, { ids, all });
    // 읽음 처리 후, 배지 카운트 동기화 (소켓)
    await emitUnreadCount(userId);
  },

  // 단 건 생성만 (트랜잭션 외부에서 호출))
  create: async (
    userId: number,
    data: {
      type: "PRICE_CHANGE" | "ARTICLE_COMMENT" | "PRODUCT_COMMENT";
      title: string;
      message?: string;
      meta?: any;
    }
  ) => {
    return notificationRepository.create(userId, data);
  },

  // 생성 + 실시간 전송 (새 알림 & 미읽음 카운트)
  createAndEmit: async (input: CreateInput) => {
    const saved = await notificationRepository.create(input.userId, {
      type: input.type,
      title: input.title,
      message: input.message,
      meta: input.meta,
    });

    // 서버 → 클라이언트: 새 알림
    emitNotification(input.userId, {
      id: saved.id,
      type: saved.type,
      title: saved.title,
      message: saved.message,
      meta: saved.meta,
      createdAt: saved.createdAt,
    });

    // 읽음 처리 후, 클라이언트와 미읽음 알림 수를 실시간 동기화
    await emitUnreadCount(input.userId);

    return saved;
  },
};

export default notificationService;
