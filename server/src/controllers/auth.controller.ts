import { Request, Response } from 'express';
import passport from 'passport';
import userModel, { CreateUserInput } from '../models/user.model';
import { generateAuthResponse } from '../utils/jwt';

export class AuthController {
  async oauthCallback(req: Request, res: Response) {
    try {
      const userData = req.user as CreateUserInput;
      
      // Check if user exists by provider ID
      let user = await userModel.findUserByProvider(userData.provider, userData.providerId!);
      
      if (!user) {
        // Check if user exists by email (for account merging)
        user = await userModel.findUserByEmail(userData.email);
        
        if (user) {
          // Update existing user with OAuth provider info
          user = await userModel.updateUser(user.id, {
            provider: userData.provider,
            providerId: userData.providerId,
            avatar: userData.avatar
          });
        } else {
          // Create new user
          user = await userModel.createUser(userData);
        }
      }

      const authResponse = generateAuthResponse(user);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${authResponse.token}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const email = (req as any).user?.email;
      if (!email) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      const user = await userModel.findUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async logout(req: Request, res: Response) {
    // Since we're using JWT, we can't invalidate the token on server-side
    // The frontend should remove the token from storage
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}

export default new AuthController();