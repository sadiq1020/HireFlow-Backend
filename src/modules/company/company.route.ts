import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { CompanyController } from './company.controller';

const router = Router();

// Public routes
router.get('/public', CompanyController.getPublicCompanyList);
router.get('/public/:id', CompanyController.getPublicCompanyById);

// Any logged-in user can register as a company
router.post('/profile', authMiddleware, CompanyController.registerCompany);

// Company only routes
router.get('/profile', authMiddleware, roleMiddleware('COMPANY'), CompanyController.getMyCompanyProfile);
router.put('/profile', authMiddleware, roleMiddleware('COMPANY'), CompanyController.updateMyCompanyProfile);
router.get('/applications', authMiddleware, roleMiddleware('COMPANY'), CompanyController.getCompanyApplications);
router.put('/applications/:applicationId/status', authMiddleware, roleMiddleware('COMPANY'), CompanyController.updateApplicationStatus);

export default router;