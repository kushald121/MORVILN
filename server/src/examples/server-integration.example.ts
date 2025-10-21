// Example of how to integrate payment routes into your main server file
// This shows how to add the payment system to your existing Express app

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import your existing routes
// import userRoutes from './routes/user.routes';
// import authRoutes from './routes/auth.routes';

// Import the new payment routes
import paymentRoutes from '../routes/payment.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Your existing routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// Add payment routes
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Payment endpoints available at http://localhost:${PORT}/api/payments`);
});

export default app;

/*
AVAILABLE PAYMENT ENDPOINTS:

POST   /api/payments/create-order     - Create new payment order
POST   /api/payments/verify-payment   - Verify payment signature
GET    /api/payments/payment/:id      - Get payment details
GET    /api/payments/order/:id        - Get order details
POST   /api/payments/capture/:id      - Capture payment
POST   /api/payments/refund           - Create refund
GET    /api/payments/payments         - Get all payments
GET    /api/payments/orders           - Get all orders
POST   /api/payments/webhook          - Razorpay webhook handler

EXAMPLE USAGE:

1. Create Order:
   curl -X POST http://localhost:5000/api/payments/create-order \
   -H "Content-Type: application/json" \
   -d '{"amount": 100, "currency": "INR"}'

2. Verify Payment:
   curl -X POST http://localhost:5000/api/payments/verify-payment \
   -H "Content-Type: application/json" \
   -d '{"razorpay_order_id": "order_xxx", "razorpay_payment_id": "pay_xxx", "razorpay_signature": "sig_xxx"}'

3. Get Payment Details:
   curl http://localhost:5000/api/payments/payment/pay_xxx

4. Create Refund:
   curl -X POST http://localhost:5000/api/payments/refund \
   -H "Content-Type: application/json" \
   -d '{"payment_id": "pay_xxx", "amount": 50}'
*/