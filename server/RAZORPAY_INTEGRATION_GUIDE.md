# Razorpay Payment Integration Guide

This guide provides a complete implementation of Razorpay payment integration for your Node.js/Express application.

## 📁 File Structure

```
server/src/
├── config/
│   └── razorpay.ts              # Razorpay configuration
├── types/
│   └── payment.types.ts         # TypeScript interfaces
├── services/
│   └── payment.service.ts       # Payment business logic
├── controllers/
│   └── payment.controller.ts    # API controllers
├── routes/
│   └── payment.routes.ts        # API routes
├── middleware/
│   └── payment.middleware.ts    # Validation & security middleware
├── utils/
│   └── payment.utils.ts         # Utility functions
└── examples/
    ├── payment-integration.example.ts
    └── frontend-integration.example.js
```

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# Razorpay Credentials
RAZORYPAY_TEST_ID=rzp_test_RW3TYnZo9MLX0n
RAZORPAY_TEST_SECRET=i3z5676NuEf2hFAOWzx2LGBZ

# Optional: Webhook Secret (set this in Razorpay dashboard)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

## 📦 Dependencies

The following packages are already installed:
- `razorpay` - Official Razorpay SDK
- `express-validator` - Request validation
- `crypto` - Built-in Node.js module for signature verification

## 🚀 Quick Start

### 1. Import Routes in Your Main App

```typescript
// app.ts or server.ts
import express from 'express';
import paymentRoutes from './src/routes/payment.routes';

const app = express();

app.use(express.json());
app.use('/api/payments', paymentRoutes);
```

### 2. Basic Payment Flow

#### Step 1: Create Order (Backend)
```bash
POST /api/payments/create-order
Content-Type: application/json

{
  "amount": 100,
  "currency": "INR",
  "receipt": "order_123",
  "notes": {
    "user_id": "user_123",
    "product": "Premium Plan"
  }
}
```

#### Step 2: Process Payment (Frontend)
```javascript
// Include Razorpay script
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

// Initialize payment
const options = {
  key: 'rzp_test_RW3TYnZo9MLX0n',
  amount: order.amount,
  currency: order.currency,
  order_id: order.id,
  handler: function (response) {
    // Verify payment on backend
    verifyPayment(response);
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

#### Step 3: Verify Payment (Backend)
```bash
POST /api/payments/verify-payment
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

## 🔗 API Endpoints

### Orders
- `POST /api/payments/create-order` - Create new payment order
- `GET /api/payments/order/:orderId` - Get order details
- `GET /api/payments/orders` - Get all orders (paginated)

### Payments
- `POST /api/payments/verify-payment` - Verify payment signature
- `GET /api/payments/payment/:paymentId` - Get payment details
- `POST /api/payments/capture/:paymentId` - Capture payment (manual)
- `GET /api/payments/payments` - Get all payments (paginated)

### Refunds
- `POST /api/payments/refund` - Create refund

### Webhooks
- `POST /api/payments/webhook` - Handle Razorpay webhooks

## 🔒 Security Features

### 1. Payment Signature Verification
All payments are verified using HMAC SHA256 signature verification.

### 2. Webhook Security
Webhooks include signature verification to ensure they come from Razorpay.

### 3. Input Validation
All endpoints include comprehensive input validation using express-validator.

### 4. Rate Limiting
Payment endpoints include rate limiting middleware (implement as needed).

## 🎯 Usage Examples

### Create Order with Validation
```typescript
import { PaymentService } from './src/services/payment.service';

const order = await PaymentService.createOrder({
  amount: 100, // Amount in rupees
  currency: 'INR',
  receipt: 'order_123',
  notes: { user_id: 'user_123' }
});
```

### Verify Payment
```typescript
const isValid = PaymentService.verifyPaymentSignature({
  razorpay_order_id: 'order_xxx',
  razorpay_payment_id: 'pay_xxx',
  razorpay_signature: 'signature_xxx'
});
```

### Create Refund
```typescript
const refund = await PaymentService.createRefund({
  payment_id: 'pay_xxx',
  amount: 50, // Partial refund
  speed: 'normal',
  notes: { reason: 'Customer request' }
});
```

## 🎨 Frontend Integration

### React/Next.js Example
```jsx
import { useState } from 'react';

const PaymentButton = ({ amount, orderData }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, ...orderData })
      });
      
      const { data: order } = await response.json();
      
      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        order_id: order.id,
        handler: async (response) => {
          // Verify payment
          await verifyPayment(response);
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};
```

## 🔄 Webhook Events

The webhook handler supports these Razorpay events:
- `payment.captured` - Payment successful
- `payment.failed` - Payment failed
- `order.paid` - Order completed
- `refund.created` - Refund processed

### Webhook Setup
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events you want to receive
4. Set webhook secret in environment variables

## 🛠 Utility Functions

The integration includes helpful utilities:
- Amount conversion (rupees ↔ paise)
- Receipt ID generation
- Signature validation
- Currency validation
- Error handling
- Payment formatting

## 🧪 Testing

### Test Credentials
```
Key ID: rzp_test_RW3TYnZo9MLX0n
Key Secret: i3z5676NuEf2hFAOWzx2LGBZ
```

### Test Card Numbers
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI ID
- Success: success@razorpay
- Failure: failure@razorpay

## 🚨 Error Handling

All endpoints include comprehensive error handling:
- Input validation errors
- Razorpay API errors
- Network errors
- Signature verification failures

## 📊 Monitoring & Logging

The integration includes:
- Payment operation logging
- Error tracking
- Performance monitoring
- Webhook event logging

## 🔄 Migration to Production

1. Replace test credentials with live credentials
2. Update webhook URLs
3. Test with small amounts first
4. Monitor error rates and performance
5. Set up proper logging and alerting

## 📞 Support

For Razorpay-specific issues:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For integration issues, check the error logs and ensure all environment variables are properly set.