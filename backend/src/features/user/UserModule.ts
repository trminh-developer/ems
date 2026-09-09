import { Router } from 'express';
import { getUserById, getRecommendedUsers, updateUserProfile } from './UserController';

const router = Router();

// Notice: Paths include /api to match the requested endpoints
router.get('/api/users', getRecommendedUsers);
router.get('/api/users/:id', getUserById);
router.put('/api/users/:id', updateUserProfile);

export default router;
