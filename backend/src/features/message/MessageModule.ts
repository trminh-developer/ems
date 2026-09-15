import { Router } from 'express';
import { getConversations, getMessages, sendMessage, markAsRead, deleteMessage } from './MessageController';

const router = Router();

router.get('/api/messages/conversations/:userId', getConversations);
router.get('/api/messages/:conversationId', getMessages);
router.post('/api/messages', sendMessage);
router.put('/api/messages/:conversationId/read', markAsRead);
router.delete('/api/messages/:messageId', deleteMessage);

export default router;
