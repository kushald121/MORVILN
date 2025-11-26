import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Email/Password Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// Supabase OAuth routes for Google
router.get('/google', authController.initiateGoogleOAuth);

// Supabase OAuth routes for Facebook
router.get('/facebook', authController.initiateFacebookOAuth);

// Shared callback route for both Google and Facebook OAuth (POST for client-side)
router.post('/oauth/callback', authController.supabaseOAuthCallback);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Update profile
router.put('/profile', authMiddleware, authController.updateProfile);

// Email verification routes
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authMiddleware, authController.resetPassword);

// Logout
router.post('/logout', authMiddleware, authController.logout);

export default router;