import { Router } from 'express';
import { getConversations, getMessages, sendMessage, markAsRead, deleteMessage } from './MessageController';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/api/messages/conversations/:userId', requireAuth, getConversations);
router.get('/api/messages/:conversationId', requireAuth, getMessages);
router.post('/api/messages', requireAuth, sendMessage);
router.put('/api/messages/:conversationId/read', requireAuth, markAsRead);
router.delete('/api/messages/:messageId', requireAuth, deleteMessage);

export default router;
