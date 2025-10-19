import { Router } from 'express';
import productsController from '../controllers/products.controller';

const router = Router();

// SEO-friendly product routes
router.get('/categories', productsController.getCategories);
router.get('/:category', productsController.getProductsByCategory);
router.get('/:category/:slug', productsController.getProductBySlug);

export default router;