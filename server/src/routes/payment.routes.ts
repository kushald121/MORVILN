import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();

// Test route
router.get('/test', (_req, res) => {
  res.json({ message: 'Payment routes are working!' });
});

// Create order route
router.post('/create-order', async (req, res) => {
  try {
    await PaymentController.createOrder(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    await PaymentController.verifyPayment(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    await PaymentController.getPaymentDetails(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get order details
router.get('/order/:orderId', async (req, res) => {
  try {
    await PaymentController.getOrderDetails(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Capture payment (for manual capture)
router.post('/capture/:paymentId', async (req, res) => {
  try {
    await PaymentController.capturePayment(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create refund
router.post('/refund', async (req, res) => {
  try {
    await PaymentController.createRefund(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    await PaymentController.getAllPayments(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    await PaymentController.getAllOrders(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    await PaymentController.handleWebhook(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;