import { Request, Response } from 'express';
import * as notificationsService from '../services/notificationsService';

export async function getNotifications(req: Request, res: Response) {
  const notifications = await notificationsService.getNotifications(req.user.id);
  res.send(notifications);
}

export async function getUnreadCount(req: Request, res: Response) {
  const count = await notificationsService.getUnreadCount(req.user.id);
  res.send({ count });
}

export async function markAsRead(req: Request, res: Response) {
  const { id } = req.params;
  await notificationsService.markAsRead(Number(id), req.user.id);
  res.status(204).send();
}
