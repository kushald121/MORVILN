import { redis } from '../../config/redis';
import { RedisOperationResult } from '../../types/redis.types';

export class FavoritesService {
  private readonly FAVORITES_EXPIRY = 5 * 24 * 60 * 60; // 5 days

  // Add item to guest favorites
  async addItem(sessionId: string, productId: string): Promise<RedisOperationResult> {
    try {
      const favKey = `favorites:${sessionId}`;
      await redis.sadd(favKey, productId);
      
      // Set expiration
      await redis.expire(favKey, this.FAVORITES_EXPIRY);
      
      return { success: true, message: 'Item added to favorites successfully' };
    } catch (error) {
      console.error('Redis favorites add error:', error);
      return { success: false, message: 'Failed to add item to favorites' };
    }
  }

  // Get guest favorites
  async getFavorites(sessionId: string): Promise<RedisOperationResult & { items: string[] }> {
    try {
      const favKey = `favorites:${sessionId}`;
      const favorites = await redis.smembers(favKey) as string[];
      
      const items = favorites.map(productId => productId);
      
      return { success: true, message: 'Favorites retrieved successfully', items };
    } catch (error) {
      console.error('Redis favorites get error:', error);
      return { success: false, message: 'Failed to retrieve favorites', items: [] };
    }
  }

  // Remove item from guest favorites
  async removeItem(sessionId: string, productId: string): Promise<RedisOperationResult> {
    try {
      const favKey = `favorites:${sessionId}`;
      await redis.srem(favKey, productId);
      
      return { success: true, message: 'Item removed from favorites successfully' };
    } catch (error) {
      console.error('Redis favorites remove error:', error);
      return { success: false, message: 'Failed to remove item from favorites' };
    }
  }

  // Check if item is in favorites
  async isInFavorites(sessionId: string, productId: string): Promise<RedisOperationResult & { isFavorite: boolean }> {
    try {
      const favKey = `favorites:${sessionId}`;
      const isMember = await redis.sismember(favKey, productId);

      return { success: true, message: 'Favorite status checked', isFavorite: isMember === 1 };
    } catch (error) {
      console.error('Redis favorites check error:', error);
      return { success: false, message: 'Failed to check favorite status', isFavorite: false };
    }
  }

  // Clear all favorites for a session
  async clearFavorites(sessionId: string): Promise<RedisOperationResult> {
    try {
      const favKey = `favorites:${sessionId}`;
      await redis.del(favKey);

      return { success: true, message: 'Favorites cleared successfully' };
    } catch (error) {
      console.error('Redis favorites clear error:', error);
      return { success: false, message: 'Failed to clear favorites' };
    }
  }

  // Get favorites count
  async getFavoritesCount(sessionId: string): Promise<RedisOperationResult & { count: number }> {
    try {
      const favKey = `favorites:${sessionId}`;
      const count = await redis.scard(favKey);

      return { success: true, message: 'Favorites count retrieved', count: count || 0 };
    } catch (error) {
      console.error('Redis favorites count error:', error);
      return { success: false, message: 'Failed to get favorites count', count: 0 };
    }
  }
}

export default new FavoritesService();