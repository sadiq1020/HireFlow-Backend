import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { AdminController } from './admin.controller';

const router = Router();

// All admin routes require auth + ADMIN role
router.use(authMiddleware, roleMiddleware('ADMIN'));

router.get('/stats', AdminController.getStats);
router.get('/charts/application-trend', AdminController.getEnrollmentTrend);
router.get('/charts/job-trend', AdminController.getJobTrend);
router.get('/charts/category-distribution', AdminController.getCategoryDistribution);
router.get('/charts/user-roles', AdminController.getUserRoleDistribution);
router.get('/companies', AdminController.getAllCompanies);
router.patch('/companies/:id/approval', AdminController.updateCompanyApproval);
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/status', AdminController.updateUserStatus);

export default router;