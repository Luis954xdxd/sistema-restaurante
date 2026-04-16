import { Router } from 'express';
import {
  getDailyOrdersController,
  getDailySummaryController,
  getDailySummaryPdfController,
} from './report.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

router.get(
  '/daily-summary',
  authenticate,
  authorizeRoles('ADMIN'),
  getDailySummaryController
);

router.get(
  '/daily-orders',
  authenticate,
  authorizeRoles('ADMIN'),
  getDailyOrdersController
);

router.get(
  '/daily-summary-pdf',
  authenticate,
  authorizeRoles('ADMIN'),
  getDailySummaryPdfController
);

export default router;