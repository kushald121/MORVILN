import { redis } from '../../config/redis';
import { GuestCart, RedisOperationResult, CartItem } from '../../types/redis.types';

export class CartService {
  private readonly CART_EXPIRY = 5 * 24 * 60 * 60; // 5 days

  // Add item to guest cart
  async addItem(sessionId: string, variantId: string, quantity: number = 1): Promise<RedisOperationResult> {
    try {
      const cartKey = `cart:${sessionId}`;
      
      // Check if variant exists in cart
      const existingQuantity = await redis.hget(cartKey, variantId);
      
      if (existingQuantity) {
        const currentQuantity = parseInt(existingQuantity as string);
        await redis.hset(cartKey, { [variantId]: currentQuantity + quantity });
      } else {
        await redis.hset(cartKey, { [variantId]: quantity });
      }
      
      // Set expiration
      await redis.expire(cartKey, this.CART_EXPIRY);
      
      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      console.error('Redis cart add error:', error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  }

  // Get guest cart items
  async getCart(sessionId: string): Promise<RedisOperationResult & { items: CartItem[] }> {
    try {
      const cartKey = `cart:${sessionId}`;
      const cartItems = await redis.hgetall(cartKey) as GuestCart;
      
      if (!cartItems || Object.keys(cartItems).length === 0) {
        return { success: true, message: 'Cart is empty', items: [] };
      }
      
      // Convert to array format with proper typing
      const items: CartItem[] = Object.entries(cartItems).map(([variantId, quantity]) => ({
        variantId,
        quantity: parseInt(quantity.toString()),
        addedAt: new Date().toISOString()
      }));
      
      return { success: true, message: 'Cart retrieved successfully', items };
    } catch (error) {
      console.error('Redis cart get error:', error);
      return { success: false, message: 'Failed to retrieve cart', items: [] };
    }
  }

  // Update item quantity in guest cart
  async updateQuantity(sessionId: string, variantId: string, quantity: number): Promise<RedisOperationResult> {
    try {
      const cartKey = `cart:${sessionId}`;

      console.log('=== REDIS UPDATE ===');
      console.log('Cart Key:', cartKey);
      console.log('Variant ID:', variantId);
      console.log('Quantity:', quantity);

      if (quantity <= 0) {
        console.log('Deleting item from Redis');
        await redis.hdel(cartKey, variantId);
      } else {
        console.log('Setting quantity in Redis');
        await redis.hset(cartKey, { [variantId]: quantity });
      }

      // Verify the update
      const updatedCart = await redis.hgetall(cartKey);
      console.log('Updated cart in Redis:', updatedCart);

      return { success: true, message: 'Cart updated successfully' };
    } catch (error) {
      console.error('Redis cart update error:', error);
      return { success: false, message: 'Failed to update cart' };
    }
  }

  // Remove item from guest cart
  async removeItem(sessionId: string, variantId: string): Promise<RedisOperationResult> {
    try {
      const cartKey = `cart:${sessionId}`;
      await redis.hdel(cartKey, variantId);
      
      return { success: true, message: 'Item removed from cart successfully' };
    } catch (error) {
      console.error('Redis cart remove error:', error);
      return { success: false, message: 'Failed to remove item from cart' };
    }
  }

  // Clear entire guest cart
  async clearCart(sessionId: string): Promise<RedisOperationResult> {
    try {
      const cartKey = `cart:${sessionId}`;
      await redis.del(cartKey);
      
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      console.error('Redis cart clear error:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  }

  // Get cart count (total items)
  async getCartCount(sessionId: string): Promise<RedisOperationResult & { count: number }> {
    try {
      const cartKey = `cart:${sessionId}`;
      const cartItems = await redis.hgetall(cartKey) as GuestCart;
      
      if (!cartItems || Object.keys(cartItems).length === 0) {
        return { success: true, message: 'Cart is empty', count: 0 };
      }
      
      const totalItems = Object.values(cartItems).reduce((sum, qty) => sum + parseInt(qty.toString()), 0);
      
      return { success: true, message: 'Cart count retrieved', count: totalItems };
    } catch (error) {
      console.error('Redis cart count error:', error);
      return { success: false, message: 'Failed to get cart count', count: 0 };
    }
  }
}

export default new CartService();