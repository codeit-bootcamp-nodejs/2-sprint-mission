import db from "../config/db";
import { ReadMarkedResult, ReadMarkedInput } from "../utils/dtos/notify.dto";

const notifyRepository = {
  // 알림 리스트 조회
  notifyList: async (
    userId: number,
    { page, size, isRead }: { page: number; size: number; isRead?: boolean }
  ) => {
    const where = { userId, ...(isRead !== undefined ? { isRead } : {}) };
    const data = await db.notify.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * size,
      take: size,
    });
    return data;
  },

  // 읽지 않은 알림 갯수
  countUnread: async (userId: number) => {
    return db.notify.count({ where: { userId, isRead: false } });
  },

  // 읽음 처리
  readMarked: async (
    userId: number,
    { ids, all }: ReadMarkedInput
  ): Promise<ReadMarkedResult> => {
    // 모든 알림 읽음
    if (all) {
      const { count } = await db.notify.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
      return { readCount: count, invalidIds: [] };
    }

    // 요청된 알림 ID (중복 제거)
    const requestedIds = Array.from(new Set(ids ?? []));
    if (requestedIds.length === 0) {
      return { readCount: 0, invalidIds: [] };
    }

    // 내 알림 목록 조회
    const myNotifications = await db.notify.findMany({
      where: { userId, id: { in: requestedIds } },
      select: { id: true },
    });

    // 내가 가진 알림 ID 집합
    const myIds = new Set(myNotifications.map((o) => o.id));

    // 소유하지 않았거나 존재하지 않는 알림 ID
    const invalidIds = requestedIds.filter((id) => !myIds.has(id));

    // 읽음 처리 가능한 알림ID
    const validTargetIds = requestedIds.filter((id) => myIds.has(id));

    // 실제 갱신
    const { count } = await db.notify.updateMany({
      where: { userId, id: { in: validTargetIds }, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return { readCount: count, invalidIds };
  },

  createNotification: async (
    userId: number,
    data: {
      type: "PRICE_CHANGE" | "ARTICLE_COMMENT" | "PRODUCT_COMMENT";
      title: string;
      message?: string;
      meta?: any;
    }
  ) => {
    return db.notify.create({
      data: {
        userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        meta: data.meta ?? undefined,
      },
    });
  },
};

export default notifyRepository;
