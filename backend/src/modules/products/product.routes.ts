import { Router } from 'express';
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  getPublicProductsController,
  toggleProductAvailabilityController,
  updateProductController,
} from './product.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { uploadProductImage } from '../../middlewares/upload.middleware';

const router = Router();

/**
 * Ruta pública del menú para clientes
 * No requiere autenticación
 */
router.get('/public', getPublicProductsController);

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  getAllProductsController
);

router.get(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  getProductByIdController
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  uploadProductImage.single('image'),
  createProductController
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  uploadProductImage.single('image'),
  updateProductController
);

router.patch(
  '/:id/toggle-availability',
  authenticate,
  authorizeRoles('ADMIN'),
  toggleProductAvailabilityController
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  deleteProductController
);

export default router;