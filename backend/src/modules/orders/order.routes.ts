import { Router } from 'express';
import {
  createOrderController,
  createPublicOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByUserIdController,
  updateOrderStatusController,
} from './order.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

/**
 * Ruta pública para pedidos desde el menú del cliente
 * No requiere login
 */
router.post('/public', createPublicOrderController);

/**
 * Rutas privadas
 */
router.post('/', authenticate, createOrderController);

router.get('/', authenticate, authorizeRoles('ADMIN', 'EMPLOYEE'), getAllOrdersController);
router.get('/user/:userId', authenticate, getOrdersByUserIdController);
router.get('/:id', authenticate, getOrderByIdController);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  updateOrderStatusController
);

export default router;