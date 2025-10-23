import { Router } from 'express';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite,
  clearFavorites
} from '../controllers/favorites.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All favorites routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/favorites
 * @desc    Get user's favorites
 * @access  Private
 */
router.get('/', getFavorites);

/**
 * @route   POST /api/favorites
 * @desc    Add product to favorites
 * @access  Private
 * @body    { productId: string }
 */
router.post('/', addToFavorites);

/**
 * @route   GET /api/favorites/:productId/check
 * @desc    Check if product is in favorites
 * @access  Private
 */
router.get('/:productId/check', checkFavorite);

/**
 * @route   DELETE /api/favorites/:productId
 * @desc    Remove product from favorites
 * @access  Private
 */
router.delete('/:productId', removeFromFavorites);

/**
 * @route   DELETE /api/favorites
 * @desc    Clear all favorites
 * @access  Private
 */
router.delete('/', clearFavorites);

export default router;
