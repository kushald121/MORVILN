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
const router = Router();

router.use('/auth', authRoutes);
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

export default router;