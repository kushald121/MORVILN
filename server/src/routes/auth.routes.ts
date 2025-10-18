import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.oauthCallback
);

// Instagram OAuth routes
router.get(
  '/instagram',
  passport.authenticate('instagram')
);

router.get(
  '/instagram/callback',
  passport.authenticate('instagram', { session: false }),
  authController.oauthCallback
);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Logout
router.post('/logout', authMiddleware, authController.logout);

export default router;