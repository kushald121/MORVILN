"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseOAuthConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Supabase OAuth configuration
exports.supabaseOAuthConfig = {
    // These are the callback URLs you've configured in Supabase
    googleCallbackURL: process.env.GOOGLE_CALLBACK || 'https://your-project.supabase.co/auth/v1/callback',
    facebookCallbackURL: process.env.FACEBOOK_CALLBACK || 'https://your-project.supabase.co/auth/v1/callback'
};
// For Supabase OAuth, we don't need to define strategies here
// The OAuth flow will be handled by redirecting to Supabase endpoints
