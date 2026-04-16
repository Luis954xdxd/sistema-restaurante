import { Router } from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  toggleCategoryStatusController,
  updateCategoryController,
} from './category.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  getAllCategoriesController
);

router.get(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  getCategoryByIdController
);

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

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  deleteCategoryController
);

export default router;