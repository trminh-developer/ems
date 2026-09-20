import { Request, Response } from 'express';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { Notification, User } = require('../../models');
    const notifications = await Notification.findAll({
      where: { user_id: req.params.userId },
      include: [{ model: User, as: 'FromUser' }],
      order: [['created_at', 'DESC']]
    });
    
    // Map to frontend format
    const formatted = notifications.map((n: any) => {
      const data = n.toJSON();
      return {
        ...data,
        fromUser: data.FromUser ? {
          id: data.FromUser.id,
          firstName: data.FromUser.first_name,
          lastName: data.FromUser.last_name,
          avatar: data.FromUser.avatar
        } : null
      };
    });
    
    return res.json(formatted);
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

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { Notification } = require('../../models');
    const { userId, type, message, fromUserId } = req.body;
    const notification = await Notification.create({
      user_id: userId,
      type,
      message,
      from_user_id: fromUserId || null
    });
    return res.json(notification);
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};
