import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();

// Create payment order
router.post('/create-order', PaymentController.createOrder);

// Verify payment
router.post('/verify-payment', PaymentController.verifyPayment);

// Get payment details
router.get('/payment/:paymentId', PaymentController.getPaymentDetails);

// Get order details
router.get('/order/:orderId', PaymentController.getOrderDetails);

// Capture payment (for manual capture)
router.post('/capture/:paymentId', PaymentController.capturePayment);

// Create refund
router.post('/refund', PaymentController.createRefund);

// Get all payments
router.get('/payments', PaymentController.getAllPayments);

// Get all orders
router.get('/orders', PaymentController.getAllOrders);

// Webhook endpoint
router.post('/webhook', PaymentController.handleWebhook);

export default router;