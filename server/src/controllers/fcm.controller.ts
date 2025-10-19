import { Request, Response } from 'express';
import fcmTokenModel from '../models/fcmToken.model';
import notificationModel from '../models/notification.model';
import fcmService from '../services/fcm.service';

export class FCMController {
  async registerToken(req: Request, res: Response) {
    try {
      const { token, deviceName, deviceType } = req.body;
      const userId = (req as any).user?.userId;

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

      const fcmToken = await fcmTokenModel.createOrUpdateToken({
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
    } catch (error) {
      console.error('Register FCM token error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to register FCM token',
      });
    }
  }

  async unregisterToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'FCM token is required',
        });
      }

      const deleted = await fcmTokenModel.deleteToken(token);

      res.json({
        success: deleted,
        message: deleted ? 'Token unregistered successfully' : 'Token not found',
      });
    } catch (error) {
      console.error('Unregister token error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unregister token',
      });
    }
  }

  async sendNotification(req: Request, res: Response) {
    try {
      const { userId, title, body, icon, image, url, data } = req.body;

      if (!userId || !title || !body) {
        return res.status(400).json({
          success: false,
          message: 'userId, title, and body are required',
        });
      }

      const result = await fcmService.sendToUser(userId, {
        title,
        body,
        icon,
        image,
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
      const { title, body, icon, image, url, data } = req.body;

      if (!title || !body) {
        return res.status(400).json({
          success: false,
          message: 'title and body are required',
        });
      }

      const result = await fcmService.sendToAll({
        title,
        body,
        icon,
        image,
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

  async supabaseWebhook(req: Request, res: Response) {
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

      const result = await fcmService.handleSupabaseNotification(record);

      res.json(result);
    } catch (error) {
      console.error('Supabase webhook error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process webhook',
      });
    }
  }

  async testNotification(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await fcmService.sendToUser(userId, {
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
    } catch (error) {
      console.error('Test notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test notification',
      });
    }
  }
}

export default new FCMController();
