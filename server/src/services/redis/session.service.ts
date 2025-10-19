import { redis } from '../../config/redis';
import { SessionData, RedisOperationResult } from '../../types/redis.types';

export class SessionService {
  // Generate session ID for guest users
  static generateSessionId(): string {
    return `guest_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  }

  // Store session data
  async setSession(sessionId: string, data: SessionData): Promise<RedisOperationResult> {
    try {
      const sessionKey = `session:${sessionId}`;
      await redis.setex(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(data));
      
      return { success: true, message: 'Session data stored successfully' };
    } catch (error) {
      console.error('Redis session set error:', error);
      return { success: false, message: 'Failed to store session data' };
    }
  }

  // Get session data
  async getSession(sessionId: string): Promise<RedisOperationResult & { data: SessionData | null }> {
    try {
      const sessionKey = `session:${sessionId}`;
      const data = await redis.get(sessionKey);
      
      return { 
        success: true, 
        message: 'Session data retrieved successfully',
        data: data ? JSON.parse(data as string) : null 
      };
    } catch (error) {
      console.error('Redis session get error:', error);
      return { success: false, message: 'Failed to retrieve session data', data: null };
    }
  }

  // Delete session
  async deleteSession(sessionId: string): Promise<RedisOperationResult> {
    try {
      const sessionKey = `session:${sessionId}`;
      await redis.del(sessionKey);
      
      return { success: true, message: 'Session deleted successfully' };
    } catch (error) {
      console.error('Redis session delete error:', error);
      return { success: false, message: 'Failed to delete session' };
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<RedisOperationResult> {
    try {
      const sessionKey = `session:${sessionId}`;
      const sessionResult = await this.getSession(sessionId);
      
      if (sessionResult.success && sessionResult.data) {
        const updatedData: SessionData = {
          ...sessionResult.data,
          lastActivity: new Date().toISOString()
        };
        await redis.setex(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(updatedData));
      }
      
      return { success: true, message: 'Session activity updated' };
    } catch (error) {
      console.error('Redis session activity update error:', error);
      return { success: false, message: 'Failed to update session activity' };
    }
  }
}

export default new SessionService();