import { Router } from 'express';
import {
  getDashboardLowStockController,
  getDashboardRecentOrdersController,
  getDashboardSummaryController,
  getDashboardTopProductsController,
} from './dashboard.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

router.get(
  '/summary',
  authenticate,
  authorizeRoles('ADMIN'),
  getDashboardSummaryController
);

router.get(
  '/low-stock',
  authenticate,
  authorizeRoles('ADMIN'),
  getDashboardLowStockController
);

router.get(
  '/top-products',
  authenticate,
  authorizeRoles('ADMIN'),
  getDashboardTopProductsController
);

router.get(
  '/recent-orders',
  authenticate,
  authorizeRoles('ADMIN'),
  getDashboardRecentOrdersController
);

export default router;