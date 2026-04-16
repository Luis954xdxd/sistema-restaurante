import { Router } from 'express';
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByUserIdController,
  updateOrderStatusController,
} from './order.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

router.post('/', authenticate, createOrderController);

router.get('/', authenticate, authorizeRoles('ADMIN'), getAllOrdersController);
router.get('/user/:userId', authenticate, getOrdersByUserIdController);
router.get('/:id', authenticate, getOrderByIdController);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN'),
  updateOrderStatusController
);

export default router;