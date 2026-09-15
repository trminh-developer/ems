import { Router } from 'express';
import { getStatuses, createStatus, toggleLike, getComments, addComment, deleteStatus } from './FeedController';

const router = Router();
router.get('/api/feed/statuses/:userId', getStatuses);
router.post('/api/feed/statuses', createStatus);
router.post('/api/feed/statuses/like', toggleLike);
router.get('/api/feed/comments/:statusId', getComments);
router.post('/api/feed/comments', addComment);
router.delete('/api/feed/statuses/:statusId', deleteStatus);

export default router;
