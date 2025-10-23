<<<<<<< HEAD
import { Request, Response } from 'express';
import supabase from '../config/database';

/**
 * Get user's cart
 */
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get cart items with product and variant details
    const { data: cartItems, error } = await supabase
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
    const cartWithMedia = await Promise.all(
      (cartItems || []).map(async (item: any) => {
        const productId = item.variant?.product?.id;
        
        if (!productId) return item;

        const { data: media } = await supabase
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
      })
    );

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
  } catch (error: any) {
    console.error('Get cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart',
      error: error.message
    });
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
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
    const { data: variant, error: variantError } = await supabase
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
    const { data: existingItem, error: checkError } = await supabase
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

      const { data, error } = await supabase
        .from('cart')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Cart item updated',
        data
      });
    }

    // Add new item to cart
    const { data, error } = await supabase
      .from('cart')
      .insert({
        user_id: userId,
        variant_id: variantId,
        quantity
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data
    });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
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
    const { data: cartItem, error: cartError } = await supabase
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
    const { data: variant } = await supabase
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
    const { data, error } = await supabase
      .from('cart')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data
    });
  } catch (error: any) {
    console.error('Update cart item error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { itemId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error: any) {
    console.error('Clear cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};
=======
import { Response } from 'express';
import { CartService } from '../services/cart.service';
import { AddToCartRequest, UpdateCartRequest } from '../types/cart.types';
import { AuthenticatedRequest } from '../types/auth.types';

export class CartController {
  // Add item to cart
  static async addToCart(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { variant_id, quantity }: AddToCartRequest = req.body;

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

      const cartItem = await CartService.addToCart(userId, { variant_id, quantity });

      res.status(201).json({
        success: true,
        data: cartItem,
        message: 'Item added to cart successfully'
      });
    } catch (error: any) {
      console.error('Error in addToCart controller:', error);
      
      if (error.message.includes('not available') || error.message.includes('insufficient stock')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to add item to cart'
      });
    }
  }

  // Get user's cart
  static async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const cart = await CartService.getCart(userId);

      res.status(200).json({
        success: true,
        data: cart,
        message: 'Cart fetched successfully'
      });
    } catch (error: any) {
      console.error('Error in getCart controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch cart'
      });
    }
  }

  // Update cart item quantity
  static async updateCartItem(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { cartItemId } = req.params;
      const { quantity }: UpdateCartRequest = req.body;

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

      const updatedItem = await CartService.updateCartItem(userId, cartItemId, quantity);

      res.status(200).json({
        success: true,
        data: updatedItem,
        message: 'Cart item updated successfully'
      });
    } catch (error: any) {
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

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update cart item'
      });
    }
  }

  // Remove item from cart
  static async removeFromCart(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
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

      await CartService.removeFromCart(userId, cartItemId);

      res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully'
      });
    } catch (error: any) {
      console.error('Error in removeFromCart controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to remove item from cart'
      });
    }
  }

  // Clear entire cart
  static async clearCart(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      await CartService.clearCart(userId);

      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } catch (error: any) {
      console.error('Error in clearCart controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to clear cart'
      });
    }
  }

  // Get cart item count
  static async getCartCount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const count = await CartService.getCartItemCount(userId);

      res.status(200).json({
        success: true,
        data: { count },
        message: 'Cart count fetched successfully'
      });
    } catch (error: any) {
      console.error('Error in getCartCount controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get cart count'
      });
    }
  }

  // Validate cart before checkout
  static async validateCart(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const validation = await CartService.validateCart(userId);

      res.status(200).json({
        success: true,
        data: validation,
        message: 'Cart validation completed'
      });
    } catch (error: any) {
      console.error('Error in validateCart controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to validate cart'
      });
    }
  }
}
>>>>>>> 15fcc80dea87b717b397b8066e5a493ae3c4b53a
