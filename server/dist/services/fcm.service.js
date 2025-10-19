"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../config/firebase"));
const firebase_2 = require("../config/firebase");
const fcmToken_model_1 = __importDefault(require("../models/fcmToken.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
class FCMService {
    async sendToUser(userId, payload) {
        try {
            if (!firebase_2.isFCMEnabled) {
                return {
                    success: false,
                    message: 'FCM is not configured',
                };
            }
            const tokens = await fcmToken_model_1.default.getTokensByUserId(userId);
            if (tokens.length === 0) {
                return {
                    success: false,
                    message: 'No FCM tokens found for user',
                };
            }
            await notification_model_1.default.createNotification({
                userId,
                title: payload.title,
                body: payload.body,
                icon: payload.icon,
                url: payload.url,
                data: payload.data,
            });
            const fcmTokens = tokens.map(t => t.token);
            const result = await this.sendToTokens(fcmTokens, payload);
            if (result.failureCount && result.failureCount > 0) {
                await this.cleanupInvalidTokens(fcmTokens);
            }
            return result;
        }
        catch (error) {
            console.error('Error sending FCM to user:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send notification',
            };
        }
    }
    async sendToAll(payload) {
        try {
            if (!firebase_2.isFCMEnabled) {
                return {
                    success: false,
                    message: 'FCM is not configured',
                };
            }
            const tokens = await fcmToken_model_1.default.getAllActiveTokens();
            if (tokens.length === 0) {
                return {
                    success: false,
                    message: 'No active FCM tokens found',
                };
            }
            const fcmTokens = tokens.map(t => t.token);
            const result = await this.sendToTokens(fcmTokens, payload);
            if (result.failureCount && result.failureCount > 0) {
                await this.cleanupInvalidTokens(fcmTokens);
            }
            return result;
        }
        catch (error) {
            console.error('Error sending FCM to all:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send notification',
            };
        }
    }
    async sendToTokens(tokens, payload) {
        try {
            if (!firebase_2.isFCMEnabled) {
                console.log('📱 MOCK NOTIFICATION:');
                console.log(`   To: ${tokens.length} device(s)`);
                console.log(`   Title: ${payload.title}`);
                console.log(`   Body: ${payload.body}`);
                console.log(`   URL: ${payload.url || '/'}`);
                console.log(`   Data:`, payload.data);
                return {
                    success: true,
                    message: `Mock: Sent to ${tokens.length} device(s) (FCM not configured)`,
                    successCount: tokens.length,
                    failureCount: 0,
                };
            }
            const message = {
                tokens,
                notification: {
                    title: payload.title,
                    body: payload.body,
                    imageUrl: payload.image,
                },
                webpush: {
                    notification: {
                        icon: payload.icon || '/icon-192x192.png',
                        badge: '/badge-72x72.png',
                    },
                    fcmOptions: {
                        link: payload.url || '/',
                    },
                },
                data: payload.data || {},
            };
            const response = await firebase_1.default.messaging().sendEachForMulticast(message);
            const errors = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    errors.push(`Token ${idx}: ${resp.error?.message || 'Unknown error'}`);
                }
            });
            return {
                success: response.successCount > 0,
                message: `Sent ${response.successCount}/${tokens.length} notifications`,
                successCount: response.successCount,
                failureCount: response.failureCount,
                errors: errors.length > 0 ? errors : undefined,
            };
        }
        catch (error) {
            console.error('Error sending FCM messages:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send messages',
                successCount: 0,
                failureCount: tokens.length,
            };
        }
    }
    async cleanupInvalidTokens(tokens) {
        for (const token of tokens) {
            try {
                await fcmToken_model_1.default.deactivateToken(token);
            }
            catch (error) {
                console.error(`Failed to deactivate token ${token}:`, error);
            }
        }
    }
    async sendOrderNotification(userId, orderDetails) {
        return this.sendToUser(userId, {
            title: 'Order Confirmed! 🎉',
            body: `Your order #${orderDetails.orderId} has been confirmed`,
            icon: '/icons/order.png',
            url: `/orders/${orderDetails.orderId}`,
            data: {
                type: 'order',
                orderId: orderDetails.orderId.toString(),
            },
        });
    }
    async sendShippingNotification(userId, orderDetails) {
        return this.sendToUser(userId, {
            title: 'Order Shipped! 📦',
            body: `Your order #${orderDetails.orderId} has been shipped`,
            icon: '/icons/shipping.png',
            url: `/orders/${orderDetails.orderId}/track`,
            data: {
                type: 'shipping',
                orderId: orderDetails.orderId.toString(),
                trackingNumber: orderDetails.trackingNumber || '',
            },
        });
    }
    async sendDeliveryNotification(userId, orderDetails) {
        return this.sendToUser(userId, {
            title: 'Order Delivered! ✅',
            body: `Your order #${orderDetails.orderId} has been delivered`,
            icon: '/icons/delivered.png',
            url: `/orders/${orderDetails.orderId}`,
            data: {
                type: 'delivery',
                orderId: orderDetails.orderId.toString(),
            },
        });
    }
    async handleSupabaseNotification(notificationData) {
        try {
            const { user_id, body } = notificationData;
            if (!user_id || !body) {
                return {
                    success: false,
                    message: 'Missing user_id or body in notification data',
                };
            }
            return await this.sendToUser(user_id, {
                title: 'New Notification',
                body: body,
                icon: '/icon-192x192.png',
                url: '/',
            });
        }
        catch (error) {
            console.error('Error handling Supabase notification:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to handle notification',
            };
        }
    }
}
exports.default = new FCMService();
