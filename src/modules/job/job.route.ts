import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { JobController } from './job.controller';

const router = Router();

// Public routes
router.get('/', JobController.getAllJobs);
router.get('/my-jobs', authMiddleware, roleMiddleware('COMPANY'), JobController.getMyJobs);
router.get('/:id', JobController.getJobById);

// Company only routes
router.post('/', authMiddleware, roleMiddleware('COMPANY'), JobController.createJob);
router.put('/:id', authMiddleware, roleMiddleware('COMPANY'), JobController.updateJob);
router.delete('/:id', authMiddleware, roleMiddleware('COMPANY'), JobController.deleteJob);

export default router;