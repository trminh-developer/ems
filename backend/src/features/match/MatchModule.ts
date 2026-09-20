import { Router } from 'express';
import { getMatches, likeUser, passUser, superlikeUser, unmatch, getWhoLikedMe, getWhoILiked } from './MatchController';

const router = Router();

router.get('/api/matches/who-liked-me/:userId', getWhoLikedMe);
router.get('/api/matches/who-i-liked/:userId', getWhoILiked);
router.get('/api/matches/:userId', getMatches);
router.post('/api/matches/like', likeUser);
router.post('/api/matches/pass', passUser);
router.post('/api/matches/superlike', superlikeUser);
router.delete('/api/matches/:id', unmatch);

export default router;

