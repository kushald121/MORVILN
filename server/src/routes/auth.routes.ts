import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Supabase OAuth routes for Google
router.get('/google', authController.initiateGoogleOAuth);

// Supabase OAuth routes for Facebook
router.get('/facebook', authController.initiateFacebookOAuth);

// Shared callback route for both Google and Facebook OAuth
router.get('/oauth/callback', authController.supabaseOAuthCallback);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Logout
router.post('/logout', authMiddleware, authController.logout);

export default router;