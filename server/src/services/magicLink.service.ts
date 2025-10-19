import supabase from '../config/supabaseclient';
import { redis, isRedisEnabled } from '../config/redis';
import crypto from 'crypto';

export interface MagicLinkResult {
  success: boolean;
  message: string;
  token?: string;
}

const isSupabaseEnabled = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && 
  process.env.SUPABASE_URL !== 'https://dummy.supabase.co');

if (!isSupabaseEnabled) {
  console.log('🔧 Supabase Status: NOT CONFIGURED');
  console.log('   SUPABASE_URL:', process.env.SUPABASE_URL || 'NOT SET');
  console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
} else {
  console.log('✅ Supabase Status: CONFIGURED');
}

export class MagicLinkService {
  private static readonly TOKEN_EXPIRY = 15 * 60;
  private static readonly REDIS_PREFIX = 'magic_link:';

  private static inMemoryTokens = new Map<string, { email: string; createdAt: number }>();

  static async generateMagicLink(email: string): Promise<MagicLinkResult> {
    try {
      const token = crypto.randomBytes(32).toString('hex');
      const magicLinkUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

      if (isRedisEnabled) {
        await redis.setex(
          `${this.REDIS_PREFIX}${token}`,
          this.TOKEN_EXPIRY,
          JSON.stringify({ email, createdAt: Date.now() })
        );
      } else {
        console.warn('⚠️  Redis not configured, using in-memory token storage (development only)');
        this.inMemoryTokens.set(token, { email, createdAt: Date.now() });
        setTimeout(() => this.inMemoryTokens.delete(token), this.TOKEN_EXPIRY * 1000);
      }

      if (isSupabaseEnabled) {
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: magicLinkUrl,
            },
          });

          if (error) {
            console.warn('Supabase OTP failed, using Redis-only mode:', error.message);
          } else {
            console.log('Magic link sent via Supabase and Redis');
          }
        } catch (supabaseError) {
          console.warn('Supabase unavailable, using Redis-only mode:', supabaseError);
        }
      } else {
        console.log('Supabase not configured, using Redis-only magic links');
      }

      return {
        success: true,
        message: isSupabaseEnabled 
          ? 'Magic link sent to your email'
          : `Magic link generated. Use this link: ${magicLinkUrl}`,
        token,
      };
    } catch (error) {
      console.error('Magic link generation error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate magic link',
      };
    }
  }

  static async verifyMagicLink(token: string, email: string): Promise<MagicLinkResult> {
    try {
      let tokenData: { email: string; createdAt: number } | null = null;

      if (isRedisEnabled) {
        const data = await redis.get(`${this.REDIS_PREFIX}${token}`);
        
        if (!data) {
          return {
            success: false,
            message: 'Invalid or expired magic link',
          };
        }

        tokenData = JSON.parse(data as string);
        await redis.del(`${this.REDIS_PREFIX}${token}`);
      } else {
        tokenData = this.inMemoryTokens.get(token) || null;
        if (tokenData) {
          this.inMemoryTokens.delete(token);
        }
      }

      if (!tokenData) {
        return {
          success: false,
          message: 'Invalid or expired magic link',
        };
      }

      if (tokenData.email !== email) {
        return {
          success: false,
          message: 'Invalid magic link',
        };
      }

      return {
        success: true,
        message: 'Magic link verified successfully',
      };
    } catch (error) {
      console.error('Magic link verification error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify magic link',
      };
    }
  }

  static async verifySupabaseOTP(email: string, token: string): Promise<MagicLinkResult> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to verify OTP',
        };
      }

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      console.error('Supabase OTP verification error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify OTP',
      };
    }
  }
}

export default MagicLinkService;
