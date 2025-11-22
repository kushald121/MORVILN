import { Router, Request, Response, NextFunction } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../types/auth.types';

const router = Router();

// Wrapper function to handle async route handlers
const asyncHandler = (fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
  };

// All cart routes require authentication
router.use(authMiddleware);

router.post('/', asyncHandler(CartController.addToCart));
router.get('/', asyncHandler(CartController.getCart));
router.get('/count', asyncHandler(CartController.getCartCount));
router.get('/validate', asyncHandler(CartController.validateCart));
router.put('/:cartItemId', asyncHandler(CartController.updateCartItem));
router.delete('/:cartItemId', asyncHandler(CartController.removeFromCart));
router.delete('/', asyncHandler(CartController.clearCart));

export default router;