import { Router } from 'express';
import authRoutes from './auth.routes';
<<<<<<< HEAD
import productRoutes from './products.route';
import magicLinkRoutes from './magicLink.route';
import pushNotificationRoutes from './pushNotification.routes';
import adminAuthRoutes from './adminAuth.routes';
import adminRoutes from './admin.routes';
import cloudinaryRoutes from './cloudinary.route';
import uploadRoutes from './upload.route';
import testRoutes from './test.routes';
import paymentRoutes from './payment.routes';
import orderRoutes from './order.routes';
import favoritesRoutes from './favorites.routes';
import cartRoutes from './cart.routes';
=======
import paymentRoutes from './payment.routes';
import emailRoutes from './email.routes';

>>>>>>> 15fcc80dea87b717b397b8066e5a493ae3c4b53a
const router = Router();

console.log('🔄 Loading routes...');

router.use('/auth', authRoutes);
<<<<<<< HEAD
router.use('/magic-link', magicLinkRoutes);
router.use('/push', pushNotificationRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminAuthRoutes); // Admin auth (login) - no middleware
router.use('/admin', adminRoutes); // Admin protected routes
router.use('/cloudinary', cloudinaryRoutes);
router.use('/upload', uploadRoutes);
router.use('/test', testRoutes);
router.use('/payment', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/cart', cartRoutes);
=======
console.log('✅ Auth routes loaded');

router.use('/payments', paymentRoutes);
console.log('✅ Payment routes loaded');

router.use('/email', emailRoutes);
console.log('✅ Gmail Email routes loaded');

// Test route to verify router is working
router.get('/test', (_req, res) => {
  res.json({ message: 'API routes are working!' });
});
>>>>>>> 15fcc80dea87b717b397b8066e5a493ae3c4b53a

export default router;