"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Google OAuth routes
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), auth_controller_1.default.oauthCallback);
// Instagram OAuth routes
router.get('/instagram', passport_1.default.authenticate('instagram'));
router.get('/instagram/callback', passport_1.default.authenticate('instagram', { session: false }), auth_controller_1.default.oauthCallback);
// Get current user
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.default.getCurrentUser);
// Logout
router.post('/logout', auth_middleware_1.authMiddleware, auth_controller_1.default.logout);
exports.default = router;
