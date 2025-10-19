import { Pool } from 'pg';
import pool from '../config/database';

export interface PushSubscription {
  id: string;
  userId?: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionInput {
  userId?: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
}

class PushSubscriptionModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async createSubscription(data: CreateSubscriptionInput): Promise<PushSubscription> {
    const query = `
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (endpoint) 
      DO UPDATE SET 
        user_id = EXCLUDED.user_id,
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth,
        user_agent = EXCLUDED.user_agent,
        is_active = true,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      data.userId || null,
      data.endpoint,
      data.keys.p256dh,
      data.keys.auth,
      data.userAgent || null,
    ];

    const result = await this.pool.query(query, values);
    return this.mapRowToSubscription(result.rows[0]);
  }

  async getSubscriptionsByUserId(userId: string): Promise<PushSubscription[]> {
    const query = 'SELECT * FROM push_subscriptions WHERE user_id = $1 AND is_active = true';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => this.mapRowToSubscription(row));
  }

  async getAllActiveSubscriptions(): Promise<PushSubscription[]> {
    const query = 'SELECT * FROM push_subscriptions WHERE is_active = true';
    const result = await this.pool.query(query);
    return result.rows.map(row => this.mapRowToSubscription(row));
  }

  async deleteSubscription(endpoint: string): Promise<boolean> {
    const query = 'DELETE FROM push_subscriptions WHERE endpoint = $1';
    const result = await this.pool.query(query, [endpoint]);
    return result.rowCount! > 0;
  }

  async deactivateSubscription(endpoint: string): Promise<boolean> {
    const query = 'UPDATE push_subscriptions SET is_active = false WHERE endpoint = $1';
    const result = await this.pool.query(query, [endpoint]);
    return result.rowCount! > 0;
  }

  private mapRowToSubscription(row: any): PushSubscription {
    return {
      id: row.id,
      userId: row.user_id,
      endpoint: row.endpoint,
      p256dh: row.p256dh,
      auth: row.auth,
      userAgent: row.user_agent,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default new PushSubscriptionModel();
