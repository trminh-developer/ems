import { Router } from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification } from './NotificationController';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();
router.get('/api/notifications/:userId', requireAuth, getNotifications);
router.get('/api/notifications/unread-count/:userId', requireAuth, getUnreadCount);
router.put('/api/notifications/:id/read', requireAuth, markAsRead);
router.put('/api/notifications/mark-all-read/:userId', requireAuth, markAllAsRead);

router.post('/api/notifications', requireAuth, createNotification);

export default router;
