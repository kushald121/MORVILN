import { Router } from 'express';
import authRoutes from './auth.routes';
import paymentRoutes from './payment.routes';
import emailRoutes from './email.routes';

const router = Router();

console.log('🔄 Loading routes...');

router.use('/auth', authRoutes);
console.log('✅ Auth routes loaded');

router.use('/payments', paymentRoutes);
console.log('✅ Payment routes loaded');

router.use('/email', emailRoutes);
console.log('✅ Gmail Email routes loaded');

// Test route to verify router is working
router.get('/test', (_req, res) => {
  res.json({ message: 'API routes are working!' });
});

export default router;