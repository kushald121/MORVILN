import { Router } from 'express';
import adminProductController from '../controllers/products.controller';
import adminController from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { upload } from '../middleware/multer';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard stats
router.get('/stats', adminController.getStats.bind(adminController));

// Product management routes
router.post('/products', upload.array('media', 10), adminController.createProductWithUpload.bind(adminController));
router.get('/products', adminProductController.getProducts);
router.get('/products/:id', adminProductController.getProduct);
router.put('/products/:id', adminProductController.updateProduct);
router.delete('/products/:id', adminProductController.deleteProduct);
router.patch('/products/:id/status', adminProductController.toggleProductStatus);

// Bulk operations
router.put('/products/bulk', adminController.bulkUpdateProducts.bind(adminController));
router.delete('/products/bulk', adminController.bulkDeleteProducts.bind(adminController));

// Orders management
router.get('/orders', adminController.getAllOrders.bind(adminController));
router.put('/orders/:id/status', adminController.updateOrderStatus.bind(adminController));

export default router;