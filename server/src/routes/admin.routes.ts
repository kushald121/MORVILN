import { Router } from 'express';
import adminProductController from '../controllers/admin/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Product management routes
router.post('/products', adminProductController.createProduct);
router.get('/products', adminProductController.getProducts);
router.get('/products/:id', adminProductController.getProduct);
router.put('/products/:id', adminProductController.updateProduct);
router.delete('/products/:id', adminProductController.deleteProduct);
router.patch('/products/:id/status', adminProductController.toggleProductStatus);

export default router;