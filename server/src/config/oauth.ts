import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as InstagramStrategy } from 'passport-instagram';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ ERROR: Missing Google OAuth credentials in .env file');
  console.error('Required: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET');
}

if (!process.env.INSTAGRAM_OAUTH_ID || !process.env.INSTAGRAM_APP_SECRET) {
  console.error('❌ ERROR: Missing Instagram OAuth credentials in .env file');
  console.error('Required: INSTAGRAM_OAUTH_ID, INSTAGRAM_APP_SECRET');
}

export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
};

export const instagramConfig = {
  clientID: process.env.INSTAGRAM_OAUTH_ID || 'dummy-client-id',
  clientSecret: process.env.INSTAGRAM_APP_SECRET || 'dummy-secret',
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/instagram/callback`
};

export const googleStrategy = new GoogleStrategy(
  googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = {
        email: profile.emails![0].value,
        name: profile.displayName,
        avatar: profile.photos![0].value,
        provider: 'google' as const,
        providerId: profile.id
      };
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
);

export const instagramStrategy = new InstagramStrategy(
  instagramConfig,
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const user = {
        email: profile.username + '@instagram.com',
        name: profile.displayName || profile.username,
        avatar: profile._json?.data?.profile_picture,
        provider: 'instagram' as const,
        providerId: profile.id
      };
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
);