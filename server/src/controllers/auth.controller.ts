import { Request, Response } from 'express';
import userModel, { CreateUserInput } from '../models/user.model';
import { generateAuthResponse } from '../utils/jwt';
import dotenv from 'dotenv';

dotenv.config();

export class AuthController {
  // Initiate Google OAuth flow through Supabase
  async initiateGoogleOAuth(req: Request, res: Response) {
    const redirectTo = `${process.env.FRONTEND_URL}/auth/success`;
    const supabaseOAuthURL = `https://ulrccgbctxkrjjqnqqbi.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    res.redirect(supabaseOAuthURL);
  }

  // Initiate Facebook OAuth flow through Supabase
  async initiateFacebookOAuth(req: Request, res: Response) {
    const redirectTo = `${process.env.FRONTEND_URL}/auth/success`;
    const supabaseOAuthURL = `https://ulrccgbctxkrjjqnqqbi.supabase.co/auth/v1/authorize?provider=facebook&redirect_to=${encodeURIComponent(redirectTo)}`;
    res.redirect(supabaseOAuthURL);
  }

  // Handle OAuth callback from Supabase
  async supabaseOAuthCallback(req: Request, res: Response) {
    try {
      // Supabase will include user data in the callback
      // For now, we'll create a basic user structure
      // In a real implementation, you would receive the user data from Supabase
      
      // This is a simplified implementation - in reality, Supabase would provide the user data
      const email = req.query.email as string || 'user@example.com';
      const name = req.query.name as string || 'OAuth User';
      const provider = (req.query.provider as 'google' | 'facebook') || 'google';
      const providerId = req.query.provider_id as string || 'provider-id';
      
      // Check if user exists by provider ID
      let user = await userModel.findUserByProvider(provider, providerId);
      
      if (!user) {
        // Check if user exists by email (for account merging)
        user = await userModel.findUserByEmail(email);
        
        if (user) {
          // Update existing user with OAuth provider info
          user = await userModel.updateUser(user.id, {
            provider: provider,
            providerId: providerId,
            name: name
          });
        } else {
          // Create new user
          user = await userModel.createUser({
            email: email,
            name: name,
            provider: provider,
            providerId: providerId,
            isVerified: true
          } as CreateUserInput);
        }
      }

      const authResponse = generateAuthResponse(user);
      
      res.cookie('auth_token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
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
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}

export default new AuthController();