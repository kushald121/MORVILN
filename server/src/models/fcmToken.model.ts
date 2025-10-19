import { Pool } from 'pg';
import pool from '../config/database';

export interface FCMToken {
  id: string;
  userId: string;
  token: string;
  deviceName?: string;
  deviceType?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFCMTokenInput {
  userId: string;
  token: string;
  deviceName?: string;
  deviceType?: string;
}

class FCMTokenModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async createOrUpdateToken(data: CreateFCMTokenInput): Promise<FCMToken> {
    const query = `
      INSERT INTO fcm_tokens (user_id, token, device_name, device_type)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (token) 
      DO UPDATE SET 
        user_id = EXCLUDED.user_id,
        device_name = EXCLUDED.device_name,
        device_type = EXCLUDED.device_type,
        is_active = true,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      data.userId,
      data.token,
      data.deviceName || null,
      data.deviceType || null,
    ];

    const result = await this.pool.query(query, values);
    return this.mapRowToToken(result.rows[0]);
  }

  async getTokensByUserId(userId: string): Promise<FCMToken[]> {
    const query = 'SELECT * FROM fcm_tokens WHERE user_id = $1 AND is_active = true';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => this.mapRowToToken(row));
  }

  async getAllActiveTokens(): Promise<FCMToken[]> {
    const query = 'SELECT * FROM fcm_tokens WHERE is_active = true';
    const result = await this.pool.query(query);
    return result.rows.map(row => this.mapRowToToken(row));
  }

  async deleteToken(token: string): Promise<boolean> {
    const query = 'DELETE FROM fcm_tokens WHERE token = $1';
    const result = await this.pool.query(query, [token]);
    return result.rowCount! > 0;
  }

  async deactivateToken(token: string): Promise<boolean> {
    const query = 'UPDATE fcm_tokens SET is_active = false WHERE token = $1';
    const result = await this.pool.query(query, [token]);
    return result.rowCount! > 0;
  }

  async deactivateAllUserTokens(userId: string): Promise<number> {
    const query = 'UPDATE fcm_tokens SET is_active = false WHERE user_id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rowCount || 0;
  }

  private mapRowToToken(row: any): FCMToken {
    return {
      id: row.id,
      userId: row.user_id,
      token: row.token,
      deviceName: row.device_name,
      deviceType: row.device_type,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default new FCMTokenModel();
