"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class PushSubscriptionModel {
    constructor() {
        this.pool = database_1.default;
    }
    async createSubscription(data) {
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
    async getSubscriptionsByUserId(userId) {
        const query = 'SELECT * FROM push_subscriptions WHERE user_id = $1 AND is_active = true';
        const result = await this.pool.query(query, [userId]);
        return result.rows.map(row => this.mapRowToSubscription(row));
    }
    async getAllActiveSubscriptions() {
        const query = 'SELECT * FROM push_subscriptions WHERE is_active = true';
        const result = await this.pool.query(query);
        return result.rows.map(row => this.mapRowToSubscription(row));
    }
    async deleteSubscription(endpoint) {
        const query = 'DELETE FROM push_subscriptions WHERE endpoint = $1';
        const result = await this.pool.query(query, [endpoint]);
        return result.rowCount > 0;
    }
    async deactivateSubscription(endpoint) {
        const query = 'UPDATE push_subscriptions SET is_active = false WHERE endpoint = $1';
        const result = await this.pool.query(query, [endpoint]);
        return result.rowCount > 0;
    }
    mapRowToSubscription(row) {
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
exports.default = new PushSubscriptionModel();
