import { Router } from 'express';
import { getAllStatuses, deleteStatus, getAllReports, resolveReport, submitVerification, getAllUsers, toggleUserStatus, getPendingVerifications, approveVerification, rejectVerification } from './AdminController';

const router = Router();

router.post('/api/users/:id/verification', submitVerification);
router.get('/api/admin/verifications', getPendingVerifications);
router.post('/api/admin/verifications/:id/approve', approveVerification);
router.post('/api/admin/verifications/:id/reject', rejectVerification);

router.get('/api/admin/users', getAllUsers);
router.put('/api/admin/users/:id/status', toggleUserStatus);


// Phase 2 Routes
router.get('/api/admin/feed', getAllStatuses);
router.delete('/api/admin/feed/:id', deleteStatus);
router.get('/api/admin/reports', getAllReports);
router.put('/api/admin/reports/:id', resolveReport);

export default router;


