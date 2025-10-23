"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All cart routes require authentication
router.use(auth_middleware_1.authMiddleware);
/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', cart_controller_1.getCart);
/**
 * @route   POST /api/cart/items
 * @desc    Add item to cart
 * @access  Private
 * @body    { variantId: string, quantity: number }
 */
router.post('/items', cart_controller_1.addToCart);
/**
 * @route   PUT /api/cart/items/:itemId
 * @desc    Update cart item quantity
 * @access  Private
 * @body    { quantity: number }
 */
router.put('/items/:itemId', cart_controller_1.updateCartItem);
/**
 * @route   DELETE /api/cart/items/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/items/:itemId', cart_controller_1.removeFromCart);
/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete('/', cart_controller_1.clearCart);
exports.default = router;
