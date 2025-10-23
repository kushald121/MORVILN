import { Router } from 'express';
<<<<<<< HEAD
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller';
=======
import { CartController } from '../controllers/cart.controller';
>>>>>>> 15fcc80dea87b717b397b8066e5a493ae3c4b53a
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

<<<<<<< HEAD
/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', getCart);

/**
 * @route   POST /api/cart/items
 * @desc    Add item to cart
 * @access  Private
 * @body    { variantId: string, quantity: number }
 */
router.post('/items', addToCart);

/**
 * @route   PUT /api/cart/items/:itemId
 * @desc    Update cart item quantity
 * @access  Private
 * @body    { quantity: number }
 */
router.put('/items/:itemId', updateCartItem);

/**
 * @route   DELETE /api/cart/items/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/items/:itemId', removeFromCart);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete('/', clearCart);

export default router;
=======
router.post('/', CartController.addToCart);
router.get('/', CartController.getCart);
router.get('/count', CartController.getCartCount);
router.get('/validate', CartController.validateCart);
router.put('/:cartItemId', CartController.updateCartItem);
router.delete('/:cartItemId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export default router;
>>>>>>> 15fcc80dea87b717b397b8066e5a493ae3c4b53a
