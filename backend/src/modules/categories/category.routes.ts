import { Router } from 'express';
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  toggleCategoryStatusController,
  updateCategoryController,
} from './category.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

router.get('/', authenticate, getAllCategoriesController);
router.get('/:id', authenticate, getCategoryByIdController);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  createCategoryController
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  updateCategoryController
);

router.patch(
  '/:id/toggle-status',
  authenticate,
  authorizeRoles('ADMIN'),
  toggleCategoryStatusController
);

export default router;