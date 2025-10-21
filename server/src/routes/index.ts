import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './products.route';
import magicLinkRoutes from './magicLink.route';
import pushNotificationRoutes from './pushNotification.routes';
import adminRoutes from './admin.routes';
import cloudinaryRoutes from './cloudinary.route';
import uploadRoutes from './upload.route';
import testRoutes from './test.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/magic-link', magicLinkRoutes);
router.use('/push', pushNotificationRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminRoutes);
router.use('/cloudinary', cloudinaryRoutes);
router.use('/upload', uploadRoutes);
router.use('/test', testRoutes);

export default router;