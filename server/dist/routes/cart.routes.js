"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Wrapper function to handle async route handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// All cart routes require authentication
router.use(auth_middleware_1.authMiddleware);
router.post('/', asyncHandler(cart_controller_1.CartController.addToCart));
router.get('/', asyncHandler(cart_controller_1.CartController.getCart));
router.get('/count', asyncHandler(cart_controller_1.CartController.getCartCount));
router.get('/validate', asyncHandler(cart_controller_1.CartController.validateCart));
router.put('/:cartItemId', asyncHandler(cart_controller_1.CartController.updateCartItem));
router.delete('/:cartItemId', asyncHandler(cart_controller_1.CartController.removeFromCart));
router.delete('/', asyncHandler(cart_controller_1.CartController.clearCart));
exports.default = router;
