import { Router } from 'express';
import { getUserById, getUserByUsername, getRecommendedUsers, getNearbyUsers, searchUsers, updateUserProfile, blockUser, reportUser } from './UserController';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/api/users', getRecommendedUsers);
router.get('/api/users/recommended', getRecommendedUsers);
router.get('/api/users/nearby', getNearbyUsers);
router.get('/api/users/search', searchUsers);
router.get('/api/users/username/:username', getUserByUsername);
router.get('/api/users/:id', getUserById);

// Protect update route
router.put('/api/users/:id', requireAuth, updateUserProfile);

router.post('/api/users/block', requireAuth, blockUser);
router.post('/api/users/report', requireAuth, reportUser);

export default router;
