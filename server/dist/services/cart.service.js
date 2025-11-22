"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const database_1 = __importDefault(require("../config/database"));
const product_service_1 = require("./product.service");
class CartService {
    // Add item to cart
    static async addToCart(userId, request) {
        try {
            const { variant_id, quantity } = request;
            // Check if product variant exists and is available
            const isAvailable = await product_service_1.ProductService.checkProductAvailability(variant_id, quantity);
            if (!isAvailable) {
                throw new Error('Product variant is not available or insufficient stock');
            }
            // Check if item already exists in cart
            const { data: existingItem, error: checkError } = await database_1.default
                .from('cart')
                .select('*')
                .eq('user_id', userId)
                .eq('variant_id', variant_id)
                .single();
            if (checkError && checkError.code !== 'PGRST116') {
                throw new Error(`Failed to check existing cart item: ${checkError.message}`);
            }
            let result;
            if (existingItem) {
                // Update existing item quantity
                const newQuantity = existingItem.quantity + quantity;
                // Check availability for new total quantity
                const isNewQuantityAvailable = await product_service_1.ProductService.checkProductAvailability(variant_id, newQuantity);
                if (!isNewQuantityAvailable) {
                    throw new Error('Insufficient stock for requested quantity');
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
                if (error) {
                    throw new Error(`Failed to update cart item: ${error.message}`);
                }
                result = data;
            }
            else {
                // Add new item to cart
                const { data, error } = await database_1.default
                    .from('cart')
                    .insert({
                    user_id: userId,
                    variant_id,
                    quantity
                })
                    .select()
                    .single();
                if (error) {
                    throw new Error(`Failed to add item to cart: ${error.message}`);
                }
                result = data;
            }
            return result;
        }
        catch (error) {
            console.error('Error in addToCart:', error);
            throw error;
        }
    }
    // Get user's cart with full details
    static async getCart(userId) {
        try {
            const { data, error } = await database_1.default
                .from('cart')
                .select(`
          *,
          variant:product_variants(
            id, sku, size, color, color_code, additional_price, stock_quantity, is_active,
            product:products(
              id, name, slug, base_price, compare_at_price, is_active,
              media:product_media(media_url, alt_text, is_primary, sort_order)
            )
          )
        `)
                .eq('user_id', userId)
                .order('added_at', { ascending: false });
            if (error) {
                throw new Error(`Failed to fetch cart: ${error.message}`);
            }
            if (!data || data.length === 0) {
                return {
                    items: [],
                    total_items: 0,
                    subtotal: 0,
                    estimated_total: 0
                };
            }
            // Process cart items with details
            const items = data
                .filter(item => item.variant?.is_active && item.variant?.product?.is_active)
                .map(item => {
                const variant = item.variant;
                const product = variant.product;
                const primaryMedia = product.media?.find((m) => m.is_primary) || product.media?.[0];
                return {
                    id: item.id,
                    user_id: item.user_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    added_at: item.added_at,
                    updated_at: item.updated_at,
                    product: {
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        base_price: product.base_price,
                        compare_at_price: product.compare_at_price,
                        is_active: product.is_active
                    },
                    variant: {
                        id: variant.id,
                        sku: variant.sku,
                        size: variant.size,
                        color: variant.color,
                        color_code: variant.color_code,
                        additional_price: variant.additional_price,
                        stock_quantity: variant.stock_quantity,
                        is_active: variant.is_active
                    },
                    media: primaryMedia ? {
                        media_url: primaryMedia.media_url,
                        alt_text: primaryMedia.alt_text
                    } : undefined
                };
            });
            // Calculate totals
            const subtotal = items.reduce((total, item) => {
                const itemPrice = item.product.base_price + item.variant.additional_price;
                return total + (itemPrice * item.quantity);
            }, 0);
            const totalItems = items.reduce((total, item) => total + item.quantity, 0);
            return {
                items,
                total_items: totalItems,
                subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
                estimated_total: Math.round(subtotal * 100) / 100 // For now, same as subtotal
            };
        }
        catch (error) {
            console.error('Error in getCart:', error);
            throw error;
        }
    }
    // Update cart item quantity
    static async updateCartItem(userId, cartItemId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }
            // First, get the cart item to check ownership and get variant_id
            const { data: cartItem, error: fetchError } = await database_1.default
                .from('cart')
                .select('*, variant_id')
                .eq('id', cartItemId)
                .eq('user_id', userId)
                .single();
            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    throw new Error('Cart item not found');
                }
                throw new Error(`Failed to fetch cart item: ${fetchError.message}`);
            }
            // Check if the new quantity is available
            const isAvailable = await product_service_1.ProductService.checkProductAvailability(cartItem.variant_id, quantity);
            if (!isAvailable) {
                throw new Error('Insufficient stock for requested quantity');
            }
            // Update the cart item
            const { data, error } = await database_1.default
                .from('cart')
                .update({
                quantity,
                updated_at: new Date().toISOString()
            })
                .eq('id', cartItemId)
                .eq('user_id', userId)
                .select()
                .single();
            if (error) {
                throw new Error(`Failed to update cart item: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('Error in updateCartItem:', error);
            throw error;
        }
    }
    // Remove item from cart
    static async removeFromCart(userId, cartItemId) {
        try {
            const { error } = await database_1.default
                .from('cart')
                .delete()
                .eq('id', cartItemId)
                .eq('user_id', userId);
            if (error) {
                throw new Error(`Failed to remove item from cart: ${error.message}`);
            }
        }
        catch (error) {
            console.error('Error in removeFromCart:', error);
            throw error;
        }
    }
    // Clear entire cart
    static async clearCart(userId) {
        try {
            const { error } = await database_1.default
                .from('cart')
                .delete()
                .eq('user_id', userId);
            if (error) {
                throw new Error(`Failed to clear cart: ${error.message}`);
            }
        }
        catch (error) {
            console.error('Error in clearCart:', error);
            throw error;
        }
    }
    // Get cart item count
    static async getCartItemCount(userId) {
        try {
            const { data, error } = await database_1.default
                .from('cart')
                .select('quantity')
                .eq('user_id', userId);
            if (error) {
                throw new Error(`Failed to get cart count: ${error.message}`);
            }
            return data?.reduce((total, item) => total + item.quantity, 0) || 0;
        }
        catch (error) {
            console.error('Error in getCartItemCount:', error);
            return 0;
        }
    }
    // Validate cart before checkout
    static async validateCart(userId) {
        try {
            const cart = await this.getCart(userId);
            const issues = [];
            for (const item of cart.items) {
                // Check if product is still active
                if (!item.product.is_active) {
                    issues.push(`Product "${item.product.name}" is no longer available`);
                    continue;
                }
                // Check if variant is still active
                if (!item.variant.is_active) {
                    issues.push(`Size "${item.variant.size}" for "${item.product.name}" is no longer available`);
                    continue;
                }
                // Check stock availability
                const isAvailable = await product_service_1.ProductService.checkProductAvailability(item.variant_id, item.quantity);
                if (!isAvailable) {
                    issues.push(`Insufficient stock for "${item.product.name}" (Size: ${item.variant.size})`);
                }
            }
            return {
                isValid: issues.length === 0,
                issues
            };
        }
        catch (error) {
            console.error('Error in validateCart:', error);
            return {
                isValid: false,
                issues: ['Failed to validate cart']
            };
        }
    }
}
exports.CartService = CartService;
