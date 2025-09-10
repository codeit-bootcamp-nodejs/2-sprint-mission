import { Prisma } from '@prisma/client';
import { db } from '../utils/db';

export interface ChangeNotificationStatus {
  isRead: boolean;
}

export interface CreateNotification {
  isRead: boolean;  
  userId: number;    
  type: string;      
  message: string;  
}


export const notificationRepository = {
  create( data: CreateNotification ){
    return db.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        isRead: data.isRead,
      },
    });
  },


  findByUserId(userId: number) {
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  },
  getNotReadNotification(userId: number) {
    return db.notification.count({
      where: { userId, isRead: false },
    });
  },

  changeMyIsReadStatus(userId: number, notificationId: number, data: ChangeNotificationStatus) {
    return db.notification.updateMany({
      where: { id: notificationId, userId: userId },
      data
    });
  }



}