import { Router } from 'express';
import adminController from '../controllers/admin.controller';

const router = Router();

// Admin login - NO authentication required
router.post('/login', adminController.adminLogin.bind(adminController));

export default router;
