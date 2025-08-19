import db from "../config/db";

const notificationRepository = {
  async findMany(
    userId: number,
    { page, size, isRead }: { page: number; size: number; isRead?: boolean }
  ) {
    const where = { userId, ...(isRead !== undefined ? { isRead } : {}) };
    const data = await db.notifications.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * size,
      take: size,
    });
    return data;
  },

  async countUnread(userId: number) {
    return db.notifications.count({ where: { userId, isRead: false } });
  },

  async markRead(
    userId: number,
    { ids, all }: { ids?: number[]; all?: boolean }
  ) {
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

  async create(
    userId: number,
    data: {
      type: "PRICE_CHANGE" | "ARTICLE_COMMENT" | "PRODUCT_COMMENT";
      title: string;
      message?: string;
      meta?: any;
    }
  ) {
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
