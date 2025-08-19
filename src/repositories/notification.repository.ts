import db from "../config/db";

const notificationRepository = {
  // 알림 리스트 조회
  findMany: async (
    userId: number,
    { page, size, isRead }: { page: number; size: number; isRead?: boolean }
  ) => {
    const where = { userId, ...(isRead !== undefined ? { isRead } : {}) };
    const data = await db.notifications.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * size,
      take: size,
    });
    return data;
  },

  // 미읽음 갯수
  countUnread: async (userId: number) => {
    return db.notifications.count({ where: { userId, isRead: false } });
  },

  // 읽음 처리
  markRead: async (
    userId: number,
    { ids, all }: { ids?: number[]; all?: boolean }
  ) => {
    if (all) {
      await db.notifications.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
      return;
    }
    if (ids?.length) {
      await db.notifications.updateMany({
        where: { userId, id: { in: ids }, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
    }
  },

  create: async (
    userId: number,
    data: {
      type: "PRICE_CHANGE" | "ARTICLE_COMMENT" | "PRODUCT_COMMENT";
      title: string;
      message?: string;
      meta?: any;
    }
  ) => {
    return db.notifications.create({
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

export default notificationRepository;
