"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const redis_1 = require("../../config/redis");
class SessionService {
    // Generate session ID for guest users
    static generateSessionId() {
        return `guest_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    }
    // Store session data
    async setSession(sessionId, data) {
        try {
            const sessionKey = `session:${sessionId}`;
            await redis_1.redis.setex(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(data));
            return { success: true, message: 'Session data stored successfully' };
        }
        catch (error) {
            console.error('Redis session set error:', error);
            return { success: false, message: 'Failed to store session data' };
        }
    }
    // Get session data
    async getSession(sessionId) {
        try {
            const sessionKey = `session:${sessionId}`;
            const data = await redis_1.redis.get(sessionKey);
            return {
                success: true,
                message: 'Session data retrieved successfully',
                data: data ? JSON.parse(data) : null
            };
        }
        catch (error) {
            console.error('Redis session get error:', error);
            return { success: false, message: 'Failed to retrieve session data', data: null };
        }
    }
    // Delete session
    async deleteSession(sessionId) {
        try {
            const sessionKey = `session:${sessionId}`;
            await redis_1.redis.del(sessionKey);
            return { success: true, message: 'Session deleted successfully' };
        }
        catch (error) {
            console.error('Redis session delete error:', error);
            return { success: false, message: 'Failed to delete session' };
        }
    }
    // Update session activity
    async updateSessionActivity(sessionId) {
        try {
            const sessionKey = `session:${sessionId}`;
            const sessionResult = await this.getSession(sessionId);
            if (sessionResult.success && sessionResult.data) {
                const updatedData = {
                    ...sessionResult.data,
                    lastActivity: new Date().toISOString()
                };
                await redis_1.redis.setex(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(updatedData));
            }
            return { success: true, message: 'Session activity updated' };
        }
        catch (error) {
            console.error('Redis session activity update error:', error);
            return { success: false, message: 'Failed to update session activity' };
        }
    }
}
exports.SessionService = SessionService;
exports.default = new SessionService();
