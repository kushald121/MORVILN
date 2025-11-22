"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesService = void 0;
const redis_1 = require("../../config/redis");
class FavoritesService {
    constructor() {
        this.FAVORITES_EXPIRY = 5 * 24 * 60 * 60; // 5 days
    }
    // Add item to guest favorites
    async addItem(sessionId, productId) {
        try {
            const favKey = `favorites:${sessionId}`;
            await redis_1.redis.sadd(favKey, productId);
            // Set expiration
            await redis_1.redis.expire(favKey, this.FAVORITES_EXPIRY);
            return { success: true, message: 'Item added to favorites successfully' };
        }
        catch (error) {
            console.error('Redis favorites add error:', error);
            return { success: false, message: 'Failed to add item to favorites' };
        }
    }
    // Get guest favorites
    async getFavorites(sessionId) {
        try {
            const favKey = `favorites:${sessionId}`;
            const favorites = await redis_1.redis.smembers(favKey);
            const items = favorites.map(productId => productId);
            return { success: true, message: 'Favorites retrieved successfully', items };
        }
        catch (error) {
            console.error('Redis favorites get error:', error);
            return { success: false, message: 'Failed to retrieve favorites', items: [] };
        }
    }
    // Remove item from guest favorites
    async removeItem(sessionId, productId) {
        try {
            const favKey = `favorites:${sessionId}`;
            await redis_1.redis.srem(favKey, productId);
            return { success: true, message: 'Item removed from favorites successfully' };
        }
        catch (error) {
            console.error('Redis favorites remove error:', error);
            return { success: false, message: 'Failed to remove item from favorites' };
        }
    }
    // Check if item is in favorites
    async isInFavorites(sessionId, productId) {
        try {
            const favKey = `favorites:${sessionId}`;
            const isMember = await redis_1.redis.sismember(favKey, productId);
            return { success: true, message: 'Favorite status checked', isFavorite: isMember === 1 };
        }
        catch (error) {
            console.error('Redis favorites check error:', error);
            return { success: false, message: 'Failed to check favorite status', isFavorite: false };
        }
    }
    // Clear all favorites for a session
    async clearFavorites(sessionId) {
        try {
            const favKey = `favorites:${sessionId}`;
            await redis_1.redis.del(favKey);
            return { success: true, message: 'Favorites cleared successfully' };
        }
        catch (error) {
            console.error('Redis favorites clear error:', error);
            return { success: false, message: 'Failed to clear favorites' };
        }
    }
    // Get favorites count
    async getFavoritesCount(sessionId) {
        try {
            const favKey = `favorites:${sessionId}`;
            const count = await redis_1.redis.scard(favKey);
            return { success: true, message: 'Favorites count retrieved', count: count || 0 };
        }
        catch (error) {
            console.error('Redis favorites count error:', error);
            return { success: false, message: 'Failed to get favorites count', count: 0 };
        }
    }
}
exports.FavoritesService = FavoritesService;
exports.default = new FavoritesService();
