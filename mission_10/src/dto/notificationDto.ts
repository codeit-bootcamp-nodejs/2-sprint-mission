export type CreateNotificationDto = {
  id?: number;
  read?: boolean;
  type: string;
  content: string;
  userId: number;
}

export type Notification = {
  id: number;
  read: boolean;
  type: string;
  content: string;
  userId: number;
}