"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class NotificationModel {
    constructor() {
        this.pool = database_1.default;
    }
    async createNotification(data) {
        const query = `
      INSERT INTO notifications (user_id, title, body, icon, url, data)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [
            data.userId,
            data.title,
            data.body,
            data.icon || null,
            data.url || null,
            data.data ? JSON.stringify(data.data) : null,
        ];
        const result = await this.pool.query(query, values);
        return this.mapRowToNotification(result.rows[0]);
    }
    async getNotificationsByUserId(userId, limit = 50) {
        const query = `
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY sent_at DESC 
      LIMIT $2
    `;
        const result = await this.pool.query(query, [userId, limit]);
        return result.rows.map(row => this.mapRowToNotification(row));
    }
    async getUnreadCount(userId) {
        const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false';
        const result = await this.pool.query(query, [userId]);
        return parseInt(result.rows[0].count);
    }
    async markAsRead(notificationId, userId) {
        const query = `
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND user_id = $2
    `;
        const result = await this.pool.query(query, [notificationId, userId]);
        return result.rowCount > 0;
    }
    async markAllAsRead(userId) {
        const query = `
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP 
      WHERE user_id = $1 AND is_read = false
    `;
        const result = await this.pool.query(query, [userId]);
        return result.rowCount || 0;
    }
    async deleteNotification(notificationId, userId) {
        const query = 'DELETE FROM notifications WHERE id = $1 AND user_id = $2';
        const result = await this.pool.query(query, [notificationId, userId]);
        return result.rowCount > 0;
    }
    mapRowToNotification(row) {
        return {
            id: row.id,
            userId: row.user_id,
            title: row.title,
            body: row.body,
            icon: row.icon,
            url: row.url,
            data: row.data,
            isRead: row.is_read,
            sentAt: row.sent_at,
            readAt: row.read_at,
        };
    }
}
exports.default = new NotificationModel();
