import { Router } from 'express';
import {
  adminOnlyController,
  getAuthenticatedUserController,
  loginController,
  registerAdminController,
} from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

router.post('/register-admin', registerAdminController);
router.post('/login', loginController);

router.get('/me', authenticate, getAuthenticatedUserController);
router.get(
  '/admin-only',
  authenticate,
  authorizeRoles('ADMIN'),
  adminOnlyController
);

export default router;