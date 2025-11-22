"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("../services/cart.service");
class CartController {
    // Add item to cart
    static async addToCart(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const { variant_id, quantity } = req.body;
            if (!variant_id || !quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Variant ID and quantity are required'
                });
            }
            if (quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Quantity must be greater than 0'
                });
            }
            const cartItem = await cart_service_1.CartService.addToCart(userId, { variant_id, quantity });
            return res.status(201).json({
                success: true,
                data: cartItem,
                message: 'Item added to cart successfully'
            });
        }
        catch (error) {
            console.error('Error in addToCart controller:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to add item to cart'
            });
        }
    }
    // Get user's cart
    static async getCart(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const cart = await cart_service_1.CartService.getCart(userId);
            return res.status(200).json({
                success: true,
                data: cart,
                message: 'Cart fetched successfully'
            });
        }
        catch (error) {
            console.error('Error in getCart controller:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch cart'
            });
        }
    }
    // Update cart item quantity
    static async updateCartItem(req, res) {
        try {
            const userId = req.user?.userId;
            const { cartItemId } = req.params;
            const { quantity } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            if (!cartItemId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart item ID is required'
                });
            }
            if (!quantity || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid quantity is required'
                });
            }
            const updatedItem = await cart_service_1.CartService.updateCartItem(userId, cartItemId, quantity);
            return res.status(200).json({
                success: true,
                data: updatedItem,
                message: 'Cart item updated successfully'
            });
        }
        catch (error) {
            console.error('Error in updateCartItem controller:', error);
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('insufficient stock')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to update cart item'
            });
        }
    }
    // Remove item from cart
    static async removeFromCart(req, res) {
        try {
            const userId = req.user?.userId;
            const { cartItemId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            if (!cartItemId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart item ID is required'
                });
            }
            await cart_service_1.CartService.removeFromCart(userId, cartItemId);
            return res.status(200).json({
                success: true,
                message: 'Item removed from cart successfully'
            });
        }
        catch (error) {
            console.error('Error in removeFromCart controller:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to remove item from cart'
            });
        }
    }
    // Clear entire cart
    static async clearCart(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            await cart_service_1.CartService.clearCart(userId);
            return res.status(200).json({
                success: true,
                message: 'Cart cleared successfully'
            });
        }
        catch (error) {
            console.error('Error in clearCart controller:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to clear cart'
            });
        }
    }
    // Get cart item count
    static async getCartCount(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const count = await cart_service_1.CartService.getCartItemCount(userId);
            return res.status(200).json({
                success: true,
                data: { count },
                message: 'Cart count fetched successfully'
            });
        }
        catch (error) {
            console.error('Error in getCartCount controller:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch cart count'
            });
        }
    }
    // Validate cart before checkout
    static async validateCart(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const validation = await cart_service_1.CartService.validateCart(userId);
            return res.status(200).json({
                success: true,
                data: validation,
                message: 'Cart validation completed'
            });
        }
        catch (error) {
            console.error('Error in validateCart controller:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to validate cart'
            });
        }
    }
}
exports.CartController = CartController;
