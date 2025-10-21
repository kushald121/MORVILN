import dotenv from 'dotenv';

dotenv.config();

// Supabase OAuth configuration
export const supabaseOAuthConfig = {
  // These are the callback URLs you've configured in Supabase
  googleCallbackURL: process.env.GOOGLE_CALLBACK || 'https://your-project.supabase.co/auth/v1/callback',
  facebookCallbackURL: process.env.FACEBOOK_CALLBACK || 'https://your-project.supabase.co/auth/v1/callback'
};

// For Supabase OAuth, we don't need to define strategies here
// The OAuth flow will be handled by redirecting to Supabase endpoints