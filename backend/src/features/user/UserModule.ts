import { Router } from 'express';
import { getUserById, getUserByUsername, getRecommendedUsers, getNearbyUsers, searchUsers, updateUserProfile } from './UserController';

const router = Router();

router.get('/api/users', getRecommendedUsers);
router.get('/api/users/recommended', getRecommendedUsers);
router.get('/api/users/nearby', getNearbyUsers);
router.get('/api/users/search', searchUsers);
router.get('/api/users/username/:username', getUserByUsername);
router.get('/api/users/:id', getUserById);
router.put('/api/users/:id', updateUserProfile);

export default router;
