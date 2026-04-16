import { Router } from 'express';
import {
  createInventoryController,
  createInventoryMovementController,
  getAllInventoryController,
  getInventoryByProductIdController,
  getInventoryMovementsByProductIdController,
  getLowStockProductsController,
  updateInventoryController,
} from './inventory.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

router.get('/', authenticate, getAllInventoryController);
router.get('/low-stock', authenticate, getLowStockProductsController);
router.get('/:productId', authenticate, getInventoryByProductIdController);
router.get(
  '/:productId/movements',
  authenticate,
  getInventoryMovementsByProductIdController
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  createInventoryController
);

router.put(
  '/:productId',
  authenticate,
  authorizeRoles('ADMIN'),
  updateInventoryController
);

router.post(
  '/movement',
  authenticate,
  authorizeRoles('ADMIN'),
  createInventoryMovementController
);

export default router;