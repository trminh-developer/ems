import { Router } from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification } from './NotificationController';

const router = Router();
router.get('/api/notifications/:userId', getNotifications);
router.get('/api/notifications/unread-count/:userId', getUnreadCount);
router.put('/api/notifications/:id/read', markAsRead);
router.put('/api/notifications/mark-all-read/:userId', markAllAsRead);

router.post('/api/notifications', createNotification);

export default router;

