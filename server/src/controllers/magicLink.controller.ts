import { Request, Response } from 'express';
import MagicLinkService from '../services/magicLink.service';
import userModel from '../models/user.model';
import { generateAuthResponse } from '../utils/jwt';

export class MagicLinkController {
  async sendMagicLink(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required',
        });
      }

      const result = await MagicLinkService.generateMagicLink(email);

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Send magic link error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send magic link',
      });
    }
  }

  async verifyMagicLink(req: Request, res: Response) {
    try {
      const { token, email } = req.body;

      if (!token || !email) {
        return res.status(400).json({
          success: false,
          message: 'Token and email are required',
        });
      }

      const verificationResult = await MagicLinkService.verifyMagicLink(token, email);

      if (!verificationResult.success) {
        return res.status(400).json(verificationResult);
      }

      let user = await userModel.findUserByEmail(email);

      if (!user) {
        user = await userModel.createUser({
          email,
          name: email.split('@')[0],
          provider: 'email',
          isVerified: true,
        });
      }

      const authResponse = generateAuthResponse(user);

      res.cookie('auth_token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: authResponse.user,
      });
    } catch (error) {
      console.error('Verify magic link error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify magic link',
      });
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { email, token } = req.body;

      if (!email || !token) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required',
        });
      }

      const result = await MagicLinkService.verifySupabaseOTP(email, token);

      if (!result.success) {
        return res.status(400).json(result);
      }

      let user = await userModel.findUserByEmail(email);

      if (!user) {
        user = await userModel.createUser({
          email,
          name: email.split('@')[0],
          provider: 'email',
          isVerified: true,
        });
      }

      const authResponse = generateAuthResponse(user);

      res.cookie('auth_token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: authResponse.user,
      });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify OTP',
      });
    }
  }
}

export default new MagicLinkController();
