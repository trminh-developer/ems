import { Router } from 'express';
import { getMatches, likeUser, unmatch } from './MatchController';

const router = Router();

router.get('/api/matches/:userId', getMatches);
router.post('/api/matches/like', likeUser);
router.delete('/api/matches/:id', unmatch);

export default router;
