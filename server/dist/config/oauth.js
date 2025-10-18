"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramStrategy = exports.googleStrategy = exports.instagramConfig = exports.googleConfig = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_instagram_1 = require("passport-instagram");
exports.googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
};
exports.instagramConfig = {
    clientID: process.env.INSTAGRAM_OAUTH_ID,
    clientSecret: process.env.INSTAGRAM_APP_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/instagram/callback`
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
exports.instagramStrategy = new passport_instagram_1.Strategy(exports.instagramConfig, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = {
            email: profile.username + '@instagram.com',
            name: profile.displayName || profile.username,
            avatar: profile._json?.data?.profile_picture,
            provider: 'instagram',
            providerId: profile.id
        };
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
});
