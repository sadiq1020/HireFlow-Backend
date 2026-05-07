import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { CategoryController } from './category.controller';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.post('/', authMiddleware, roleMiddleware('ADMIN'), CategoryController.createCategory);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), CategoryController.updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), CategoryController.deleteCategory);

export default router;