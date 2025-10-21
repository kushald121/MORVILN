import passport from "passport";

// Supabase OAuth doesn't require Passport strategies
// The OAuth flow is handled entirely by Supabase

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;