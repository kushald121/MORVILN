import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/multer';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Image upload routes (protected)
router.post('/image', authMiddleware, uploadSingleImage, uploadController.uploadImage);
router.post('/images', authMiddleware, uploadMultipleImages, uploadController.uploadMultipleImages);
router.delete('/:publicId', authMiddleware, uploadController.deleteImage);
router.post('/optimize-url', uploadController.generateOptimizedUrl);

export default router;