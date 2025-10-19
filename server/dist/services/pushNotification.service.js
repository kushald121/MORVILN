"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webPush_1 = __importDefault(require("../config/webPush"));
const pushSubscription_model_1 = __importDefault(require("../models/pushSubscription.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
class PushNotificationService {
    async sendToUser(userId, payload) {
        try {
            const subscriptions = await pushSubscription_model_1.default.getSubscriptionsByUserId(userId);
            if (subscriptions.length === 0) {
                return {
                    success: false,
                    message: 'No active subscriptions found for user',
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
            const results = await this.sendToSubscriptions(subscriptions, payload);
            return results;
        }
        catch (error) {
            console.error('Error sending notification to user:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send notification',
            };
        }
    }
    async sendToAll(payload) {
        try {
            const subscriptions = await pushSubscription_model_1.default.getAllActiveSubscriptions();
            if (subscriptions.length === 0) {
                return {
                    success: false,
                    message: 'No active subscriptions found',
                };
            }
            const results = await this.sendToSubscriptions(subscriptions, payload);
            return results;
        }
        catch (error) {
            console.error('Error sending notification to all:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send notification',
            };
        }
    }
    async sendToSubscriptions(subscriptions, payload) {
        let successCount = 0;
        let failureCount = 0;
        const errors = [];
        const notificationPayload = JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icon-192x192.png',
            badge: payload.badge || '/badge-72x72.png',
            url: payload.url || '/',
            data: payload.data || {},
            actions: payload.actions || [],
        });
        const promises = subscriptions.map(async (sub) => {
            try {
                await webPush_1.default.sendNotification({
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth,
                    },
                }, notificationPayload);
                successCount++;
            }
            catch (error) {
                failureCount++;
                if (error.statusCode === 410 || error.statusCode === 404) {
                    await pushSubscription_model_1.default.deactivateSubscription(sub.endpoint);
                    errors.push(`Subscription expired: ${sub.endpoint}`);
                }
                else {
                    errors.push(`Failed to send to ${sub.endpoint}: ${error.message}`);
                }
            }
        });
        await Promise.all(promises);
        return {
            success: successCount > 0,
            message: `Sent ${successCount} notifications successfully, ${failureCount} failed`,
            successCount,
            failureCount,
            errors: errors.length > 0 ? errors : undefined,
        };
    }
    async sendOrderNotification(userId, orderDetails) {
        return this.sendToUser(userId, {
            title: 'Order Confirmed! 🎉',
            body: `Your order #${orderDetails.orderId} has been confirmed`,
            icon: '/icons/order.png',
            url: `/orders/${orderDetails.orderId}`,
            data: {
                type: 'order',
                orderId: orderDetails.orderId,
            },
            actions: [
                { action: 'view', title: 'View Order' },
                { action: 'track', title: 'Track Order' },
            ],
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
                orderId: orderDetails.orderId,
                trackingNumber: orderDetails.trackingNumber,
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
                orderId: orderDetails.orderId,
            },
        });
    }
    async sendPromotionNotification(payload) {
        return this.sendToAll({
            ...payload,
            icon: payload.icon || '/icons/promotion.png',
        });
    }
}
exports.default = new PushNotificationService();
