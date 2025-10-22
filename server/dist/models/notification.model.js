"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabaseclient_1 = __importDefault(require("../config/supabaseclient"));
class NotificationModel {
    async createNotification(data) {
        const { data: notification, error } = await supabaseclient_1.default
            .from('notifications')
            .insert({
            user_id: data.userId,
            title: data.title,
            body: data.body,
            icon: data.icon || null,
            url: data.url || null,
            data: data.data || null,
        })
            .select()
            .single();
        if (error) {
            console.error('Error creating notification:', error);
            throw new Error(`Failed to create notification: ${error.message}`);
        }
        return this.mapRowToNotification(notification);
    }
    async getNotificationsByUserId(userId, limit = 50) {
        const { data, error } = await supabaseclient_1.default
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('sent_at', { ascending: false })
            .limit(limit);
        if (error) {
            console.error('Error getting notifications by user ID:', error);
            throw new Error(`Failed to get notifications: ${error.message}`);
        }
        return (data || []).map((row) => this.mapRowToNotification(row));
    }
    async getUnreadCount(userId) {
        const { count, error } = await supabaseclient_1.default
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);
        if (error) {
            console.error('Error getting unread count:', error);
            throw new Error(`Failed to get unread count: ${error.message}`);
        }
        return count || 0;
    }
    async markAsRead(notificationId, userId) {
        const { error } = await supabaseclient_1.default
            .from('notifications')
            .update({
            is_read: true,
            read_at: new Date().toISOString()
        })
            .eq('id', notificationId)
            .eq('user_id', userId);
        if (error) {
            console.error('Error marking notification as read:', error);
            throw new Error(`Failed to mark notification as read: ${error.message}`);
        }
        return true;
    }
    async markAllAsRead(userId) {
        const { data, error } = await supabaseclient_1.default
            .from('notifications')
            .update({
            is_read: true,
            read_at: new Date().toISOString()
        })
            .eq('user_id', userId)
            .eq('is_read', false)
            .select('id');
        if (error) {
            console.error('Error marking all notifications as read:', error);
            throw new Error(`Failed to mark all notifications as read: ${error.message}`);
        }
        return data?.length || 0;
    }
    async deleteNotification(notificationId, userId) {
        const { error } = await supabaseclient_1.default
            .from('notifications')
            .delete()
            .eq('id', notificationId)
            .eq('user_id', userId);
        if (error) {
            console.error('Error deleting notification:', error);
            throw new Error(`Failed to delete notification: ${error.message}`);
        }
        return true;
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
