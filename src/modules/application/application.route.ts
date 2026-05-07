import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { ApplicationController } from './application.controller';

const router = Router();

router.post('/', authMiddleware, roleMiddleware('SEEKER'), ApplicationController.applyToJob);
router.get('/my', authMiddleware, roleMiddleware('SEEKER'), ApplicationController.getMyApplications);
router.get('/:id', authMiddleware, ApplicationController.getApplicationById);

export default router;