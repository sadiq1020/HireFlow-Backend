import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { SavedJobController } from './savedJob.controller';

const router = Router();

router.post('/', authMiddleware, roleMiddleware('SEEKER'), SavedJobController.saveJob);
router.delete('/:jobId', authMiddleware, roleMiddleware('SEEKER'), SavedJobController.unsaveJob);
router.get('/my', authMiddleware, roleMiddleware('SEEKER'), SavedJobController.getMySavedJobs);

export default router;