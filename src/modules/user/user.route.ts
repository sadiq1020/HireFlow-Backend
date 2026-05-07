import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { UserController } from './user.controller';

const router = Router();

router.get('/profile', authMiddleware, UserController.getMyProfile);
router.put('/profile', authMiddleware, UserController.updateMyProfile);

export default router;