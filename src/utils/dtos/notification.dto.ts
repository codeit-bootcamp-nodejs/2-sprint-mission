import { NotificationType } from "@prisma/client";

export type NotificationResponse = {
  id: number;
  type: NotificationType;
  title: string;
  message?: string | null;
  meta?: any | null;
  isRead: boolean;
  createdAt: Date;
};
