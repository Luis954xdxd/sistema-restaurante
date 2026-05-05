import { Router } from 'express';
import {
  createOrderController,
  createPublicOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByUserIdController,
  getPublicOrderStatusController,
  updateOrderStatusController,
} from './order.controller';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

/**
 * Ruta pública para crear pedidos desde el menú del cliente.
 * No requiere login.
 */
router.post('/public', createPublicOrderController);

/**
 * Ruta pública para consultar el estado de un pedido.
 * Esta ruta la usará el cliente desde /order-status/:orderId.
 *
 * IMPORTANTE:
 * Debe ir antes de router.get('/:id'),
 * para que Express no confunda "public" con un id.
 */
router.get('/public/:id/status', getPublicOrderStatusController);

/**
 * Rutas privadas.
 * Requieren login.
 */
router.post('/', authenticate, createOrderController);

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  getAllOrdersController
);

router.get('/user/:userId', authenticate, getOrdersByUserIdController);

router.get('/:id', authenticate, getOrderByIdController);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  updateOrderStatusController
);

export default router;