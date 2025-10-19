import { Router } from 'express';
import fcmController from '../controllers/fcm.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register-token', authMiddleware, fcmController.registerToken);
router.post('/unregister-token', authMiddleware, fcmController.unregisterToken);

router.post('/send', authMiddleware, fcmController.sendNotification);
router.post('/send-all', authMiddleware, fcmController.sendToAll);
router.post('/test', authMiddleware, fcmController.testNotification);

router.get('/notifications', authMiddleware, fcmController.getNotifications);
router.put('/notifications/:notificationId/read', authMiddleware, fcmController.markAsRead);
router.put('/notifications/read-all', authMiddleware, fcmController.markAllAsRead);

router.post('/webhook/supabase', fcmController.supabaseWebhook);

export default router;
