import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

router.post('/', CartController.addToCart);
router.get('/', CartController.getCart);
router.get('/count', CartController.getCartCount);
router.get('/validate', CartController.validateCart);
router.put('/:cartItemId', CartController.updateCartItem);
router.delete('/:cartItemId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export default router;