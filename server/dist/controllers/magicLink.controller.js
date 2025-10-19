"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicLinkController = void 0;
const magicLink_service_1 = __importDefault(require("../services/magicLink.service"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
class MagicLinkController {
    async sendMagicLink(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required',
                });
            }
            const result = await magicLink_service_1.default.generateMagicLink(email);
            if (!result.success) {
                return res.status(500).json(result);
            }
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Send magic link error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send magic link',
            });
        }
    }
    async verifyMagicLink(req, res) {
        try {
            const { token, email } = req.body;
            if (!token || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Token and email are required',
                });
            }
            const verificationResult = await magicLink_service_1.default.verifyMagicLink(token, email);
            if (!verificationResult.success) {
                return res.status(400).json(verificationResult);
            }
            let user = await user_model_1.default.findUserByEmail(email);
            if (!user) {
                user = await user_model_1.default.createUser({
                    email,
                    name: email.split('@')[0],
                    provider: 'email',
                    isVerified: true,
                });
            }
            const authResponse = (0, jwt_1.generateAuthResponse)(user);
            res.cookie('auth_token', authResponse.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                success: true,
                message: 'Authentication successful',
                user: authResponse.user,
            });
        }
        catch (error) {
            console.error('Verify magic link error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to verify magic link',
            });
        }
    }
    async verifyOTP(req, res) {
        try {
            const { email, token } = req.body;
            if (!email || !token) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and OTP are required',
                });
            }
            const result = await magicLink_service_1.default.verifySupabaseOTP(email, token);
            if (!result.success) {
                return res.status(400).json(result);
            }
            let user = await user_model_1.default.findUserByEmail(email);
            if (!user) {
                user = await user_model_1.default.createUser({
                    email,
                    name: email.split('@')[0],
                    provider: 'email',
                    isVerified: true,
                });
            }
            const authResponse = (0, jwt_1.generateAuthResponse)(user);
            res.cookie('auth_token', authResponse.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                success: true,
                message: 'Authentication successful',
                user: authResponse.user,
            });
        }
        catch (error) {
            console.error('Verify OTP error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to verify OTP',
            });
        }
    }
}
exports.MagicLinkController = MagicLinkController;
exports.default = new MagicLinkController();
