import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './products.routes';
import magicLinkRoutes from './magicLink.route';
import pushNotificationRoutes from './pushNotification.routes';
import productRoutes from './products.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './orders.routes';
import uploadRoutes from './upload.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/magic-link', magicLinkRoutes);
router.use('/push', pushNotificationRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes); // Add this

export default router;
