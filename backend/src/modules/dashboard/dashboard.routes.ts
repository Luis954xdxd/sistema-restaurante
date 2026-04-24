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
  authorizeRoles('ADMIN','EMPLOYEE'),
  getDashboardSummaryController
);

router.get(
  '/low-stock',
  authenticate,
  authorizeRoles('ADMIN','EMPLOYEE'),
  getDashboardLowStockController
);

router.get(
  '/top-products',
  authenticate,
  authorizeRoles('ADMIN','EMPLOYEE'),
  getDashboardTopProductsController
);

router.get(
  '/recent-orders',
  authenticate,
  authorizeRoles('ADMIN','EMPLOYEE'),
  getDashboardRecentOrdersController
);

export default router;