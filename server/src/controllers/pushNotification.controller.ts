import { Request, Response } from 'express';
import pushSubscriptionModel from '../models/pushSubscription.model';
import notificationModel from '../models/notification.model';
import pushNotificationService from '../services/pushNotification.service';

export class PushNotificationController {
  async subscribe(req: Request, res: Response) {
    try {
      const { endpoint, keys } = req.body;
      const userId = (req as any).user?.userId;

      if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
        return res.status(400).json({
          success: false,
          message: 'Missing required subscription data',
        });
      }

      const subscription = await pushSubscriptionModel.createSubscription({
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
    } catch (error) {
      console.error('Subscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create push subscription',
      });
    }
  }

  async unsubscribe(req: Request, res: Response) {
    try {
      const { endpoint } = req.body;

      if (!endpoint) {
        return res.status(400).json({
          success: false,
          message: 'Endpoint is required',
        });
      }

      const deleted = await pushSubscriptionModel.deleteSubscription(endpoint);

      res.json({
        success: deleted,
        message: deleted ? 'Unsubscribed successfully' : 'Subscription not found',
      });
    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe',
      });
    }
  }

  async sendNotification(req: Request, res: Response) {
    try {
      const { userId, title, body, icon, url, data } = req.body;

      if (!userId || !title || !body) {
        return res.status(400).json({
          success: false,
          message: 'userId, title, and body are required',
        });
      }

      const result = await pushNotificationService.sendToUser(userId, {
        title,
        body,
        icon,
        url,
        data,
      });

      res.json(result);
    } catch (error) {
      console.error('Send notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
      });
    }
  }

  async sendToAll(req: Request, res: Response) {
    try {
      const { title, body, icon, url, data } = req.body;

      if (!title || !body) {
        return res.status(400).json({
          success: false,
          message: 'title and body are required',
        });
      }

      const result = await pushNotificationService.sendToAll({
        title,
        body,
        icon,
        url,
        data,
      });

      res.json(result);
    } catch (error) {
      console.error('Send to all error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
      });
    }
  }

  async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const notifications = await notificationModel.getNotificationsByUserId(userId, limit);
      const unreadCount = await notificationModel.getUnreadCount(userId);

      res.json({
        success: true,
        notifications,
        unreadCount,
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get notifications',
      });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { notificationId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const marked = await notificationModel.markAsRead(notificationId, userId);

      res.json({
        success: marked,
        message: marked ? 'Notification marked as read' : 'Notification not found',
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
      });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const count = await notificationModel.markAllAsRead(userId);

      res.json({
        success: true,
        message: `Marked ${count} notifications as read`,
        count,
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read',
      });
    }
  }

  async getVapidPublicKey(req: Request, res: Response) {
    res.json({
      success: true,
      publicKey: process.env.VAPID_PUBLIC_KEY || '',
    });
  }
}

export default new PushNotificationController();
