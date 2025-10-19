"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
class AuthController {
    async oauthCallback(req, res) {
        try {
            const userData = req.user;
            // Check if user exists by provider ID
            let user = await user_model_1.default.findUserByProvider(userData.provider, userData.providerId);
            if (!user) {
                // Check if user exists by email (for account merging)
                user = await user_model_1.default.findUserByEmail(userData.email);
                if (user) {
                    // Update existing user with OAuth provider info
                    user = await user_model_1.default.updateUser(user.id, {
                        provider: userData.provider,
                        providerId: userData.providerId,
                        avatar: userData.avatar
                    });
                }
                else {
                    // Create new user
                    user = await user_model_1.default.createUser(userData);
                }
            }
            const authResponse = (0, jwt_1.generateAuthResponse)(user);
            res.cookie('auth_token', authResponse.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
        }
        catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
        }
    }
    async getCurrentUser(req, res) {
        try {
            const email = req.user?.email;
            if (!email) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }
            const user = await user_model_1.default.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            res.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    isVerified: user.isVerified
                }
            });
        }
        catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    async logout(req, res) {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
