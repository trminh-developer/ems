import { Router } from 'express';
import { getMessages, sendMessage } from './MessageController';

const router = Router();

router.get('/api/messages/:conversationId', getMessages);
router.post('/api/messages', sendMessage);

export default router;
