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