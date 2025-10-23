"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const database_1 = __importDefault(require("../config/database"));
/**
 * Get user's cart
 */
const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        // Get cart items with product and variant details
        const { data: cartItems, error } = await database_1.default
            .from('cart')
            .select(`
        id,
        quantity,
        added_at,
        updated_at,
        variant:product_variants (
          id,
          sku,
          size,
          color,
          additional_price,
          stock_quantity,
          product:products (
            id,
            name,
            slug,
            base_price,
            compare_at_price,
            description
          )
        )
      `)
            .eq('user_id', userId);
        if (error) {
            throw error;
        }
        // Get media for each product
        const cartWithMedia = await Promise.all((cartItems || []).map(async (item) => {
            const productId = item.variant?.product?.id;
            if (!productId)
                return item;
            const { data: media } = await database_1.default
                .from('product_media')
                .select('media_url, media_type, alt_text, is_primary')
                .eq('product_id', productId)
                .eq('is_primary', true)
                .limit(1)
                .single();
            return {
                ...item,
                variant: {
                    ...item.variant,
                    product: {
                        ...item.variant.product,
                        image: media?.media_url || null
                    }
                }
            };
        }));
        // Calculate totals
        const subtotal = cartWithMedia.reduce((sum, item) => {
            const basePrice = parseFloat(item.variant?.product?.base_price || 0);
            const additionalPrice = parseFloat(item.variant?.additional_price || 0);
            return sum + (basePrice + additionalPrice) * item.quantity;
        }, 0);
        return res.status(200).json({
            success: true,
            message: 'Cart retrieved successfully',
            data: {
                items: cartWithMedia,
                count: cartWithMedia.length,
                subtotal: subtotal.toFixed(2)
            }
        });
    }
    catch (error) {
        console.error('Get cart error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve cart',
            error: error.message
        });
    }
};
exports.getCart = getCart;
/**
 * Add item to cart
 */
const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { variantId, quantity = 1 } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        if (!variantId) {
            return res.status(400).json({
                success: false,
                message: 'Variant ID is required'
            });
        }
        // Check if variant exists and has sufficient stock
        const { data: variant, error: variantError } = await database_1.default
            .from('product_variants')
            .select('id, stock_quantity, is_active')
            .eq('id', variantId)
            .single();
        if (variantError || !variant) {
            return res.status(404).json({
                success: false,
                message: 'Product variant not found'
            });
        }
        if (!variant.is_active) {
            return res.status(400).json({
                success: false,
                message: 'Product variant is not available'
            });
        }
        if (variant.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock_quantity} items available in stock`
            });
        }
        // Check if item already exists in cart
        const { data: existingItem, error: checkError } = await database_1.default
            .from('cart')
            .select('id, quantity')
            .eq('user_id', userId)
            .eq('variant_id', variantId)
            .single();
        if (existingItem) {
            // Update existing cart item
            const newQuantity = existingItem.quantity + quantity;
            if (variant.stock_quantity < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${variant.stock_quantity} items available in stock`
                });
            }
            const { data, error } = await database_1.default
                .from('cart')
                .update({
                quantity: newQuantity,
                updated_at: new Date().toISOString()
            })
                .eq('id', existingItem.id)
                .select()
                .single();
            if (error)
                throw error;
            return res.status(200).json({
                success: true,
                message: 'Cart item updated',
                data
            });
        }
        // Add new item to cart
        const { data, error } = await database_1.default
            .from('cart')
            .insert({
            user_id: userId,
            variant_id: variantId,
            quantity
        })
            .select()
            .single();
        if (error)
            throw error;
        return res.status(201).json({
            success: true,
            message: 'Item added to cart',
            data
        });
    }
    catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add item to cart',
            error: error.message
        });
    }
};
exports.addToCart = addToCart;
/**
 * Update cart item quantity
 */
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { itemId } = req.params;
        const { quantity } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }
        // Get cart item
        const { data: cartItem, error: cartError } = await database_1.default
            .from('cart')
            .select('id, variant_id')
            .eq('id', itemId)
            .eq('user_id', userId)
            .single();
        if (cartError || !cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        // Check variant stock
        const { data: variant } = await database_1.default
            .from('product_variants')
            .select('stock_quantity')
            .eq('id', cartItem.variant_id)
            .single();
        if (variant && variant.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock_quantity} items available in stock`
            });
        }
        // Update quantity
        const { data, error } = await database_1.default
            .from('cart')
            .update({
            quantity,
            updated_at: new Date().toISOString()
        })
            .eq('id', itemId)
            .eq('user_id', userId)
            .select()
            .single();
        if (error)
            throw error;
        return res.status(200).json({
            success: true,
            message: 'Cart item updated',
            data
        });
    }
    catch (error) {
        console.error('Update cart item error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update cart item',
            error: error.message
        });
    }
};
exports.updateCartItem = updateCartItem;
/**
 * Remove item from cart
 */
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { itemId } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const { error } = await database_1.default
            .from('cart')
            .delete()
            .eq('id', itemId)
            .eq('user_id', userId);
        if (error)
            throw error;
        return res.status(200).json({
            success: true,
            message: 'Item removed from cart'
        });
    }
    catch (error) {
        console.error('Remove from cart error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to remove item from cart',
            error: error.message
        });
    }
};
exports.removeFromCart = removeFromCart;
/**
 * Clear entire cart
 */
const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const { error } = await database_1.default
            .from('cart')
            .delete()
            .eq('user_id', userId);
        if (error)
            throw error;
        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully'
        });
    }
    catch (error) {
        console.error('Clear cart error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to clear cart',
            error: error.message
        });
    }
};
exports.clearCart = clearCart;
