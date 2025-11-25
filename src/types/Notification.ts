type Notification = {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  userId: number;
  relatedId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export default Notification;
