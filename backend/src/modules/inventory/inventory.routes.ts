// Importamos Router.
import { Router } from 'express';

// Importamos controladores.
import {
  createInventoryMovementController,
  getInventoryMovementsController,
  getInventoryController,
} from './inventory.controller';

// Importamos middlewares.
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

// Creamos router.
const router = Router();

/**
 * Obtener inventario.
 * Lo pueden ver ADMIN y EMPLOYEE.
 */
router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  getInventoryController
);

/**
 * Obtener historial de movimientos de inventario.
 * Lo pueden ver ADMIN y EMPLOYEE.
 */
router.get(
  '/movements',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  getInventoryMovementsController
);

/**
 * Registrar movimiento de inventario.
 * Lo pueden hacer ADMIN y EMPLOYEE.
 */
router.post(
  '/movements',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  createInventoryMovementController
);

export default router;