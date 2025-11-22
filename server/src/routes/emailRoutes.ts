import { Router } from 'express';
import emailController from '../controllers/email.controller';

const router = Router();

// Test routes
router.get('/test-connection', emailController.testConnection);
router.post('/test-send', emailController.sendTestEmail);

// Template-based email routes
router.post('/order-confirmation', emailController.sendOrderConfirmation);
router.post('/product-launch', emailController.sendProductLaunch);
router.post('/custom-offer', emailController.sendCustomOffer);
router.post('/welcome', emailController.sendWelcomeEmail);
router.post('/password-reset', emailController.sendPasswordResetEmail);
router.post('/admin-order-notification', emailController.sendAdminOrderNotification);

// Verification route
router.get('/verify', emailController.verifyEmailService);

export default router;