"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookStrategy = exports.googleStrategy = exports.facebookConfig = exports.googleConfig = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️  WARNING: Missing Google OAuth credentials in .env file');
    console.warn('   Google login will not work without: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET');
}
if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    console.warn('⚠️  WARNING: Missing Facebook OAuth credentials in .env file');
    console.warn('   Facebook login will not work without: FACEBOOK_APP_ID, FACEBOOK_APP_SECRET');
}
exports.googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
};
exports.facebookConfig = {
    clientID: process.env.FACEBOOK_APP_ID || 'dummy-client-id',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'dummy-secret',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
    profileFields: ['id', 'emails', 'name', 'picture']
};
exports.googleStrategy = new passport_google_oauth20_1.Strategy(exports.googleConfig, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = {
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0].value,
            provider: 'google',
            providerId: profile.id
        };
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
});
exports.facebookStrategy = new passport_facebook_1.Strategy(exports.facebookConfig, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = {
            email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
            name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || profile.displayName,
            avatar: profile.photos?.[0]?.value,
            provider: 'facebook',
            providerId: profile.id
        };
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
});
