import { Router } from 'express';
import {
  createTableWithQrController,
  downloadTableQrPdfController,
} from './table.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

router.post(
  '/generate',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  createTableWithQrController
);

router.get(
  '/generate-pdf',
  authenticate,
  authorizeRoles('ADMIN', 'EMPLOYEE'),
  downloadTableQrPdfController
);

export default router;