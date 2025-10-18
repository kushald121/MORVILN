import passport from "passport";
import { googleStrategy, instagramStrategy } from './oauth';

passport.use(googleStrategy);
passport.use(instagramStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;