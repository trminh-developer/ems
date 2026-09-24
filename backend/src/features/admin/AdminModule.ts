import { Router } from 'express';
import { revokeUserVerification, updateUserRole, setupAdmin, getAllStatuses, deleteStatus, getAllReports, resolveReport, submitVerification, getAllUsers, toggleUserStatus, getPendingVerifications, approveVerification, rejectVerification } from './AdminController';
import { requireAuth, requireAdmin } from '../../middlewares/authMiddleware';

const router = Router();

// Protected admin routes
router.get('/api/admin/verifications', requireAuth, requireAdmin, getPendingVerifications);
router.post('/api/admin/verifications/:id/approve', requireAuth, requireAdmin, approveVerification);
router.post('/api/admin/verifications/:id/reject', requireAuth, requireAdmin, rejectVerification);

router.get('/api/admin/users', requireAuth, requireAdmin, getAllUsers);
router.put('/api/admin/users/:id/status', requireAuth, requireAdmin, toggleUserStatus);
router.put('/api/admin/users/:id/role', requireAuth, requireAdmin, updateUserRole);
router.put('/api/admin/users/:id/verification/revoke', requireAuth, requireAdmin, revokeUserVerification);

router.get('/api/admin/feed', requireAuth, requireAdmin, getAllStatuses);
router.delete('/api/admin/feed/:id', requireAuth, requireAdmin, deleteStatus);
router.get('/api/admin/reports', requireAuth, requireAdmin, getAllReports);
router.put('/api/admin/reports/:id', requireAuth, requireAdmin, resolveReport);

// Verification submittal by users (auth required)
router.post('/api/users/:id/verification', requireAuth, submitVerification);

// Setup default admin (temporary backdoor - should be removed or strictly protected in prod)
// Left as is for testing but usually should be commented out or secret-protected
router.get('/api/admin/setup', setupAdmin);

export default router;
