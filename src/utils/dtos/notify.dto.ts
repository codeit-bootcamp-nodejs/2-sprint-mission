import { NotifyType } from "@prisma/client";

export type notifyResponse = {
  id: number;
  type: NotifyType;
  title: string;
  message?: string | null;
  meta?: any | null;
  isRead: boolean;
  createdAt: Date;
};

export type CreateInput = {
  userId: number;
  type: "PRICE_CHANGE" | "ARTICLE_COMMENT" | "PRODUCT_COMMENT";
  title: string;
  message?: string;
  meta?: any;
};

export type ReadMarkedResult = {
  readCount: number;
  invalidIds: number[];
};

export type ReadMarkedInput = {
  ids?: number[];
  all?: boolean;
};

export type ListQuery = {
  page: number;
  size: number;
  isRead?: boolean;
};
