import { Router } from 'express';
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  toggleProductAvailabilityController,
  updateProductController,
} from './product.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { uploadProductImage } from '../../middlewares/upload.middleware';

const router = Router();

router.get('/', authenticate, getAllProductsController);
router.get('/:id', authenticate, getProductByIdController);

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

export default router;