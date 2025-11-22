"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Email/Password Authentication
router.post('/register', auth_controller_1.default.register);
router.post('/login', auth_controller_1.default.login);
// Supabase OAuth routes for Google
router.get('/google', auth_controller_1.default.initiateGoogleOAuth);
// Supabase OAuth routes for Facebook
router.get('/facebook', auth_controller_1.default.initiateFacebookOAuth);
// Shared callback route for both Google and Facebook OAuth (POST for client-side)
router.post('/oauth/callback', auth_controller_1.default.supabaseOAuthCallback);
// Get current user
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.default.getCurrentUser);
// Logout
router.post('/logout', auth_middleware_1.authMiddleware, auth_controller_1.default.logout);
exports.default = router;
