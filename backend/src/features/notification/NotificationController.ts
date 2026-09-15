import { Request, Response } from 'express';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { Notification } = require('../../models');
    const notifications = await Notification.findAll({
      where: { user_id: req.params.userId },
      order: [['created_at', 'DESC']]
    });
    return res.json(notifications);
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { Notification } = require('../../models');
    const count = await Notification.count({
      where: { user_id: req.params.userId, is_read: false }
    });
    return res.json({ count });
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { Notification } = require('../../models');
    await Notification.update({ is_read: true }, { where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { Notification } = require('../../models');
    await Notification.update({ is_read: true }, { where: { user_id: req.params.userId } });
    return res.json({ success: true });
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};
