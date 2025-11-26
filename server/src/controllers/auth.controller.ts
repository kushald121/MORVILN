import { Request, Response } from 'express';
import userModel, { CreateUserInput } from '../models/user.model';
import { generateAuthResponse, verifyPassword, hashPassword } from '../utils/jwt';
import supabase, { supabaseAdmin } from '../config/supabaseclient';
import dotenv from 'dotenv';

dotenv.config();

export class AuthController {
  // Email/Password Registration
  async register(req: Request, res: Response) {
    try {
      console.log('📝 Registration request received:', {
        body: req.body,
        hasEmail: !!req.body.email,
        hasPassword: !!req.body.password,
        hasName: !!req.body.name
      });

      const { email, password, name, phone } = req.body;

      // Validate input
      if (!email || !password || !name) {
        console.log('❌ Validation failed:', { email: !!email, password: !!password, name: !!name });
        return res.status(400).json({
          success: false,
          message: 'Email, password, and name are required',
          received: { hasEmail: !!email, hasPassword: !!password, hasName: !!name }
        });
      }

      // Check if user already exists
      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Use Supabase Auth to create user with email confirmation
      console.log('🔐 Creating user with Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          },
          emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`
        }
      });

      if (authError) {
        console.error('❌ Supabase Auth error:', authError);
        return res.status(400).json({
          success: false,
          message: authError.message || 'Failed to create account'
        });
      }

      if (!authData.user) {
        return res.status(400).json({
          success: false,
          message: 'Failed to create user'
        });
      }

      // Hash password for our custom users table
      console.log('🔐 Hashing password...');
      const hashedPassword = await hashPassword(password);

      // Create user in our custom users table
      console.log('👤 Creating user in database...');
      const user = await userModel.createUser({
        email,
        passwordHash: hashedPassword,
        name,
        phone,
        provider: 'email',
        isVerified: false
      } as CreateUserInput);
      console.log('✅ User created successfully:', user.id);

      // Check if email confirmation is required
      const requiresConfirmation = !authData.session;

      if (requiresConfirmation) {
        console.log('📧 Email confirmation required');
        return res.status(201).json({
          success: true,
          message: 'Registration successful! Please check your email to confirm your account.',
          requiresEmailConfirmation: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: false
          }
        });
      }

      // If no confirmation needed (shouldn't happen with email provider)
      // Generate auth response
      const authResponse = generateAuthResponse(user);

      // Set cookie
      res.cookie('auth_token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log('✅ Registration successful for:', email);
      res.status(201).json({
        success: true,
        token: authResponse.token,
        user: authResponse.user
      });
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({
        success: false,
        message: error.message || 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Email/Password Login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user in custom database
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }

      // Verify password against custom database
      if (!user.passwordHash) {
        return res.status(401).json({
          success: false,
          message: 'Please use OAuth to login (Google/Facebook)'
        });
      }

      const isPasswordValid = await verifyPassword(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Also sign in to Supabase Auth to create session (optional - for features that need Supabase)
      if (user.provider === 'email') {
        try {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) {
            console.log('Supabase sign in info:', signInError.message);
            // Don't block login if Supabase fails - our custom auth is sufficient
          }
        } catch (supabaseError) {
          console.log('Supabase sign in error - continuing with custom auth');
          // Continue with custom auth - this is fine
        }
      }

      // Update last login (use supabaseAdmin to bypass RLS)
      await supabaseAdmin
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Generate auth response from custom database
      const authResponse = generateAuthResponse(user);

      // Set cookie
      res.cookie('auth_token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        token: authResponse.token,
        user: authResponse.user
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  // Initiate Google OAuth flow through Supabase
  async initiateGoogleOAuth(req: Request, res: Response) {
    const redirectTo = `${process.env.FRONTEND_URL}/auth/callback`;
    const supabaseOAuthURL = `${process.env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    res.redirect(supabaseOAuthURL);
  }

  // Initiate Facebook OAuth flow through Supabase
  async initiateFacebookOAuth(req: Request, res: Response) {
    const redirectTo = `${process.env.FRONTEND_URL}/auth/callback`;
    const supabaseOAuthURL = `${process.env.SUPABASE_URL}/auth/v1/authorize?provider=facebook&redirect_to=${encodeURIComponent(redirectTo)}`;
    res.redirect(supabaseOAuthURL);
  }

  // Handle OAuth callback from Supabase
  async supabaseOAuthCallback(req: Request, res: Response) {
    try {
      // Receive OAuth user data from client after Supabase auth
      const { email, name, provider, providerId, avatar } = req.body;
      
      if (!email || !provider || !providerId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required OAuth data'
        });
      }
      
      // Check if user exists by provider ID
      let user = await userModel.findUserByProvider(provider, providerId);
      
      if (!user) {
        // Check if user exists by email (for account merging)
        user = await userModel.findUserByEmail(email);
        
        if (user) {
          // Update existing user with OAuth provider info
          user = await userModel.updateUser(user.id, {
            provider: provider as any,
            providerId: providerId,
            name: name || user.name,
            avatarUrl: avatar || user.avatarUrl
          });
        } else {
          // Create new user
          user = await userModel.createUser({
            email: email,
            name: name || 'User',
            provider: provider as any,
            providerId: providerId,
            avatarUrl: avatar,
            isVerified: true
          } as CreateUserInput);
        }
      }

      // Update last login (use supabaseAdmin to bypass RLS)
      await supabaseAdmin
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      const authResponse = generateAuthResponse(user);
      
      res.cookie('auth_token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      res.json({
        success: true,
        token: authResponse.token,
        user: authResponse.user
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).json({
        success: false,
        message: 'OAuth authentication failed'
      });
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      const user = await userModel.getUserById(userId);
      
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
          phone: user.phone,
          avatar: user.avatarUrl,
          isVerified: user.isVerified,
          provider: user.provider
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

  // Forgot Password - Send reset email using Supabase
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Check if user exists
      const user = await userModel.findUserByEmail(email);
      
      // For security, always return success even if user doesn't exist
      // This prevents email enumeration attacks
      if (!user) {
        return res.json({
          success: true,
          message: 'If an account exists with this email, a password reset link has been sent'
        });
      }

      // Use Supabase's built-in password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`,
      });

      if (error) {
        console.error('Supabase password reset error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        });
      }

      res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Reset Password - Update password with new one
  async resetPassword(req: Request, res: Response) {
    try {
      const { password, token } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'New password is required'
        });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Get user from token (set by auth middleware or from Supabase session)
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Get user to find their email
      const user = await userModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update password in Supabase Auth (CRITICAL - this is the main auth system)
      if (user.provider === 'email') {
        try {
          const { data: supabaseUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(user.id);
          
          if (!getUserError && supabaseUser) {
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              user.id,
              { password }
            );
            
            if (updateError) {
              console.error('Supabase password update error:', updateError);
              throw updateError;
            }
            console.log('✅ Password updated in Supabase Auth');
          }
        } catch (supabaseError) {
          console.error('Supabase Auth error:', supabaseError);
          // Continue to update custom table even if Supabase fails
        }
      }

      // Hash the new password for our custom table
      const hashedPassword = await hashPassword(password);

      // Update user's password in our custom users table
      await userModel.updateUser(userId, {
        passwordHash: hashedPassword
      });

      console.log('✅ Password updated in custom users table');

      res.json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { name, phone } = req.body;

      if (!name && !phone) {
        return res.status(400).json({
          success: false,
          message: 'At least one field (name or phone) is required'
        });
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;

      const updatedUser = await userModel.updateUser(userId, updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          avatar: updatedUser.avatarUrl
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  // Verify Email - Handle email confirmation callback
  async verifyEmail(req: Request, res: Response) {
    try {
      const { token_hash, type } = req.query;

      if (!token_hash || type !== 'email') {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification link'
        });
      }

      // Verify email with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token_hash as string,
        type: 'email'
      });

      if (error) {
        console.error('Email verification error:', error);
        return res.status(400).json({
          success: false,
          message: error.message || 'Email verification failed'
        });
      }

      if (!data.user) {
        return res.status(400).json({
          success: false,
          message: 'Email verification failed'
        });
      }

      // Update user's verified status in our database
      const user = await userModel.findUserByEmail(data.user.email!);
      if (user) {
        await userModel.updateUser(user.id, { isVerified: true });
      }

      res.json({
        success: true,
        message: 'Email verified successfully!',
        user: data.user
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify email'
      });
    }
  }

  // Resend Verification Email
  async resendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Check if user exists
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      }

      // Resend verification email using Supabase
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`
        }
      });

      if (error) {
        console.error('Resend verification error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to resend verification email'
        });
      }

      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      console.error('Resend verification email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification email'
      });
    }
  }
}

export default new AuthController();