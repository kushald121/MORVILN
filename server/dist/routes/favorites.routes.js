"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorites_controller_1 = require("../controllers/favorites.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All favorites routes require authentication
router.use(auth_middleware_1.authMiddleware);
/**
 * @route   GET /api/favorites
 * @desc    Get user's favorites
 * @access  Private
 */
router.get('/', favorites_controller_1.getFavorites);
/**
 * @route   POST /api/favorites
 * @desc    Add product to favorites
 * @access  Private
 * @body    { productId: string }
 */
router.post('/', favorites_controller_1.addToFavorites);
/**
 * @route   GET /api/favorites/:productId/check
 * @desc    Check if product is in favorites
 * @access  Private
 */
router.get('/:productId/check', favorites_controller_1.checkFavorite);
/**
 * @route   DELETE /api/favorites/:productId
 * @desc    Remove product from favorites
 * @access  Private
 */
router.delete('/:productId', favorites_controller_1.removeFromFavorites);
/**
 * @route   DELETE /api/favorites
 * @desc    Clear all favorites
 * @access  Private
 */
router.delete('/', favorites_controller_1.clearFavorites);
exports.default = router;
