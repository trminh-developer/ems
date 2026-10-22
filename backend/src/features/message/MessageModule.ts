import { Router } from 'express';
import { getConversations, getMessages, sendMessage, markAsRead, deleteMessage, recallMessage } from './MessageController';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/api/messages/conversations/:userId', requireAuth, getConversations);
router.get('/api/messages/:conversationId', requireAuth, getMessages);
router.post('/api/messages', requireAuth, sendMessage);
router.put('/api/messages/:conversationId/read', requireAuth, markAsRead);
router.put('/api/messages/:messageId/recall', requireAuth, recallMessage);
router.post('/api/messages/:messageId/recall', requireAuth, recallMessage);
router.delete('/api/messages/:messageId/for-me', requireAuth, deleteMessage);
router.delete('/api/messages/:messageId', requireAuth, deleteMessage);

export default router;
