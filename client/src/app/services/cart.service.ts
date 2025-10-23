import { cartAPI } from '@/lib/api';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

class CartService {
  // Get user's cart
  static async getCart(): Promise<Cart> {
    try {
      const response = await cartAPI.get();
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  // Add item to cart
  static async addItem(productId: string, quantity: number, variantId?: string): Promise<Cart> {
    try {
      const response = await cartAPI.addItem({ productId, quantity, variantId });
      return response.data;
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
  }

  // Update cart item quantity
  static async updateItemQuantity(itemId: string, quantity: number): Promise<Cart> {
    try {
      const response = await cartAPI.updateItem(itemId, quantity);
      return response.data;
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  }

  // Remove item from cart
  static async removeItem(itemId: string): Promise<Cart> {
    try {
      const response = await cartAPI.removeItem(itemId);
      return response.data;
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }

  // Clear entire cart
  static async clearCart(): Promise<void> {
    try {
      await cartAPI.clear();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Sync cart with server (useful after login)
  static async syncCart(items: any[]): Promise<Cart> {
    try {
      const response = await cartAPI.sync(items);
      return response.data;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }

  // Get cart item count
  static getItemCount(cart: Cart | null): number {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Calculate cart total
  static calculateTotal(cart: Cart | null): number {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export { CartService };
