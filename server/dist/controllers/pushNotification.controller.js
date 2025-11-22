"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationController = void 0;
const pushSubscription_model_1 = __importDefault(require("../models/pushSubscription.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const pushNotification_service_1 = __importDefault(require("../services/pushNotification.service"));
class PushNotificationController {
    async subscribe(req, res) {
        try {
            const { endpoint, keys } = req.body;
            const userId = req.user?.userId;
            if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required subscription data',
                });
            }
            const subscription = await pushSubscription_model_1.default.createSubscription({
                userId,
                endpoint,
                keys,
                userAgent: req.headers['user-agent'],
            });
            res.status(201).json({
                success: true,
                message: 'Push subscription created successfully',
                subscription: {
                    id: subscription.id,
                    endpoint: subscription.endpoint,
                },
            });
        }
        catch (error) {
            console.error('Subscribe error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create push subscription',
            });
        }
    }
    async unsubscribe(req, res) {
        try {
            const { endpoint } = req.body;
            if (!endpoint) {
                return res.status(400).json({
                    success: false,
                    message: 'Endpoint is required',
                });
            }
            const deleted = await pushSubscription_model_1.default.deleteSubscription(endpoint);
            res.json({
                success: deleted,
                message: deleted ? 'Unsubscribed successfully' : 'Subscription not found',
            });
        }
        catch (error) {
            console.error('Unsubscribe error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to unsubscribe',
            });
        }
    }
    async sendNotification(req, res) {
        try {
            const { userId, title, body, icon, url, data } = req.body;
            if (!userId || !title || !body) {
                return res.status(400).json({
                    success: false,
                    message: 'userId, title, and body are required',
                });
            }
            const result = await pushNotification_service_1.default.sendToUser(userId, {
                title,
                body,
                icon,
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
            const { title, body, icon, url, data } = req.body;
            if (!title || !body) {
                return res.status(400).json({
                    success: false,
                    message: 'title and body are required',
                });
            }
            const result = await pushNotification_service_1.default.sendToAll({
                title,
                body,
                icon,
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
    async getVapidPublicKey(req, res) {
        res.json({
            success: true,
            publicKey: process.env.VAPID_PUBLIC_KEY || '',
        });
    }
}
exports.PushNotificationController = PushNotificationController;
exports.default = new PushNotificationController();
