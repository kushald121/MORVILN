"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCMController = void 0;
const fcmToken_model_1 = __importDefault(require("../models/fcmToken.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const fcm_service_1 = __importDefault(require("../services/fcm.service"));
class FCMController {
    async registerToken(req, res) {
        try {
            const { token, deviceName, deviceType } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'FCM token is required',
                });
            }
            const fcmToken = await fcmToken_model_1.default.createOrUpdateToken({
                userId,
                token,
                deviceName,
                deviceType,
            });
            res.status(201).json({
                success: true,
                message: 'FCM token registered successfully',
                tokenId: fcmToken.id,
            });
        }
        catch (error) {
            console.error('Register FCM token error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to register FCM token',
            });
        }
    }
    async unregisterToken(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'FCM token is required',
                });
            }
            const deleted = await fcmToken_model_1.default.deleteToken(token);
            res.json({
                success: deleted,
                message: deleted ? 'Token unregistered successfully' : 'Token not found',
            });
        }
        catch (error) {
            console.error('Unregister token error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to unregister token',
            });
        }
    }
    async sendNotification(req, res) {
        try {
            const { userId, title, body, icon, image, url, data } = req.body;
            if (!userId || !title || !body) {
                return res.status(400).json({
                    success: false,
                    message: 'userId, title, and body are required',
                });
            }
            const result = await fcm_service_1.default.sendToUser(userId, {
                title,
                body,
                icon,
                image,
                url,
                data,
            });
            res.json(result);
        }
        catch (error) {
            console.error('Send notification error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send notification',
            });
        }
    }
    async sendToAll(req, res) {
        try {
            const { title, body, icon, image, url, data } = req.body;
            if (!title || !body) {
                return res.status(400).json({
                    success: false,
                    message: 'title and body are required',
                });
            }
            const result = await fcm_service_1.default.sendToAll({
                title,
                body,
                icon,
                image,
                url,
                data,
            });
            res.json(result);
        }
        catch (error) {
            console.error('Send to all error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send notification',
            });
        }
    }
    async getNotifications(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            const limit = parseInt(req.query.limit) || 50;
            const notifications = await notification_model_1.default.getNotificationsByUserId(userId, limit);
            const unreadCount = await notification_model_1.default.getUnreadCount(userId);
            res.json({
                success: true,
                notifications,
                unreadCount,
            });
        }
        catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get notifications',
            });
        }
    }
    async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            const marked = await notification_model_1.default.markAsRead(notificationId, userId);
            res.json({
                success: marked,
                message: marked ? 'Notification marked as read' : 'Notification not found',
            });
        }
        catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to mark notification as read',
            });
        }
    }
    async markAllAsRead(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            const count = await notification_model_1.default.markAllAsRead(userId);
            res.json({
                success: true,
                message: `Marked ${count} notifications as read`,
                count,
            });
        }
        catch (error) {
            console.error('Mark all as read error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to mark all notifications as read',
            });
        }
    }
    async supabaseWebhook(req, res) {
        try {
            const { type, record } = req.body;
            if (type !== 'INSERT') {
                return res.json({ success: true, message: 'Ignored non-INSERT event' });
            }
            if (!record || !record.user_id || !record.body) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid webhook payload',
                });
            }
            const result = await fcm_service_1.default.handleSupabaseNotification(record);
            res.json(result);
        }
        catch (error) {
            console.error('Supabase webhook error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process webhook',
            });
        }
    }
    async testNotification(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
            const result = await fcm_service_1.default.sendToUser(userId, {
                title: 'Test Notification 🔔',
                body: 'This is a test push notification from MORVILN',
                icon: '/icon-192x192.png',
                url: '/',
                data: {
                    type: 'test',
                    timestamp: new Date().toISOString(),
                },
            });
            res.json(result);
        }
        catch (error) {
            console.error('Test notification error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send test notification',
            });
        }
    }
}
exports.FCMController = FCMController;
exports.default = new FCMController();
