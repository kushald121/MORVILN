import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// Public routes (no authentication required)
router.get('/', ProductController.getProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/categories', ProductController.getCategories);
router.get('/search', ProductController.searchProducts);
router.get('/availability/:variantId', ProductController.checkAvailability);
router.get('/:identifier', ProductController.getProduct); // Must be last to avoid conflicts

export default router;