"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("./AdminController");
const router = (0, express_1.Router)();
router.post('/api/users/:id/verification', AdminController_1.submitVerification);
router.get('/api/admin/verifications', AdminController_1.getPendingVerifications);
router.post('/api/admin/verifications/:id/approve', AdminController_1.approveVerification);
router.post('/api/admin/verifications/:id/reject', AdminController_1.rejectVerification);
router.get('/api/admin/users', AdminController_1.getAllUsers);
router.put('/api/admin/users/:id/status', AdminController_1.toggleUserStatus);
router.put('/api/admin/users/:id/role', AdminController_1.updateUserRole);
router.put('/api/admin/users/:id/verification/revoke', AdminController_1.revokeUserVerification);
// Phase 2 Routes
router.get('/api/admin/feed', AdminController_1.getAllStatuses);
router.delete('/api/admin/feed/:id', AdminController_1.deleteStatus);
router.get('/api/admin/reports', AdminController_1.getAllReports);
router.put('/api/admin/reports/:id', AdminController_1.resolveReport);
// Setup default admin (temporary backdoor)
router.get('/api/admin/setup', AdminController_1.setupAdmin);
exports.default = router;
