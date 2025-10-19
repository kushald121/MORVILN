import passport from "passport";
import { googleStrategy, facebookStrategy } from './oauth';

passport.use(googleStrategy);
passport.use(facebookStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;