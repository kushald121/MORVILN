import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  WARNING: Missing Google OAuth credentials in .env file');
  console.warn('   Google login will not work without: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET');
}

if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
  console.warn('⚠️  WARNING: Missing Facebook OAuth credentials in .env file');
  console.warn('   Facebook login will not work without: FACEBOOK_APP_ID, FACEBOOK_APP_SECRET');
}

export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
};

export const facebookConfig = {
  clientID: process.env.FACEBOOK_APP_ID || 'dummy-client-id',
  clientSecret: process.env.FACEBOOK_APP_SECRET || 'dummy-secret',
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name', 'picture']
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

export const facebookStrategy = new FacebookStrategy(
  facebookConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = {
        email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
        name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || profile.displayName,
        avatar: profile.photos?.[0]?.value,
        provider: 'facebook' as const,
        providerId: profile.id
      };
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
);