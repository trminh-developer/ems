import { Router } from 'express';
import { getStatuses, createStatus, toggleLike, addComment, getComments, deleteStatus } from './FeedController';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/api/feed/:userId', requireAuth, getStatuses);
router.post('/api/feed', requireAuth, createStatus);
router.post('/api/feed/like', requireAuth, toggleLike);
router.get('/api/feed/:statusId/comments', requireAuth, getComments);
router.post('/api/feed/comment', requireAuth, addComment);
router.delete('/api/feed/:statusId', requireAuth, deleteStatus);

export default router;
