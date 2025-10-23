import { Router } from 'express';
import emailController from '../controllers/email.controller';

const router = Router();

// Test routes
router.get('/test-connection', emailController.testConnection);
router.post('/test-send', emailController.sendTestEmail);

// Template-based email routes
router.post('/order-confirmation', emailController.sendOrderConfirmation);
router.post('/admin-order-notification', emailController.sendAdminOrderNotification);
router.post('/welcome', emailController.sendWelcomeEmail);
router.post('/password-reset', emailController.sendPasswordResetEmail);
router.post('/email-verification', emailController.sendEmailVerification);
router.post('/order-status-update', emailController.sendOrderStatusUpdate);

// Custom email routes
router.post('/send-custom', emailController.sendCustomEmail);
router.post('/send-bulk', emailController.sendBulkEmail);

export default router;