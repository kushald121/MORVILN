import express from 'express';
import paymentRoutes from '../routes/payment.routes';
import { 
  validateCreateOrder, 
  validatePaymentVerification, 
  validateRefundCreation,
  logPaymentOperation,
  webhookSecurity
} from '../middleware/payment.middleware';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply payment middleware to all payment routes
app.use('/api/payments', logPaymentOperation);

// Mount payment routes
app.use('/api/payments', paymentRoutes);

// Example usage in your main application:

// 1. Create Order Endpoint with Validation
app.post('/api/payments/create-order', validateCreateOrder, async (req, res) => {
  // This will be handled by PaymentController.createOrder
});

// 2. Verify Payment Endpoint with Validation
app.post('/api/payments/verify-payment', validatePaymentVerification, async (req, res) => {
  // This will be handled by PaymentController.verifyPayment
});

// 3. Webhook Endpoint with Security
app.post('/api/payments/webhook', webhookSecurity, async (req, res) => {
  // This will be handled by PaymentController.handleWebhook
});

// 4. Refund Endpoint with Validation
app.post('/api/payments/refund', validateRefundCreation, async (req, res) => {
  // This will be handled by PaymentController.createRefund
});

export default app;

/*
USAGE EXAMPLES:

1. Create Order:
POST /api/payments/create-order
{
  "amount": 100,
  "currency": "INR",
  "receipt": "order_123",
  "notes": {
    "user_id": "user_123",
    "product": "Premium Plan"
  }
}

2. Verify Payment:
POST /api/payments/verify-payment
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}

3. Get Payment Details:
GET /api/payments/payment/pay_xxx

4. Create Refund:
POST /api/payments/refund
{
  "payment_id": "pay_xxx",
  "amount": 50,
  "speed": "normal",
  "notes": {
    "reason": "Customer request"
  }
}

5. Get All Payments:
GET /api/payments/payments?count=10&skip=0&from=2024-01-01&to=2024-12-31

6. Webhook (Razorpay will call this):
POST /api/payments/webhook
Headers: x-razorpay-signature: signature
Body: Razorpay webhook payload
*/