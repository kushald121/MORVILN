import { Router } from 'express';
import authRoutes from './auth.routes';
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
import userRoutes from './user.routes';
import emailRoutes from "./emailRoutes";
import productDetailRoutes from './product.routes';
import heroRoutes from './hero.routes';

const router = Router();

console.log('🔄 Loading routes...');

router.use('/auth', authRoutes);
router.use('/magic-link', magicLinkRoutes);
router.use('/push', pushNotificationRoutes);
// Mount specific product routes before general ones to avoid conflicts
router.use('/product', productDetailRoutes); // Regular product API endpoints
router.use('/products', productRoutes); // SEO-friendly routes
router.use('/admin', adminAuthRoutes); // Admin auth (login) - no middleware
router.use('/admin', adminRoutes); // Admin protected routes
router.use('/cloudinary', cloudinaryRoutes);
router.use('/upload', uploadRoutes);
router.use('/test', testRoutes);
router.use('/payment', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/cart', cartRoutes);
router.use('/user', userRoutes); // User routes (addresses, profile, etc.)
router.use('/email', emailRoutes);
router.use('/', heroRoutes);
console.log('✅ Auth routes loaded');
console.log('✅ Payment routes loaded');
console.log('✅ Gmail Email routes loaded');
console.log('✅ Cart routes loaded');
console.log('✅ Product routes loaded');
console.log('✅ Products routes loaded');
console.log('✅ Admin routes loaded');

// Test route to verify router is working
router.get('/test', (_req, res) => {
  res.json({ message: 'API routes are working!' });
});

export default router;