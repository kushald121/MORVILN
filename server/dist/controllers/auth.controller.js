"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
const supabaseclient_1 = require("../config/supabaseclient");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthController {
    // Email/Password Registration
    async register(req, res) {
        try {
            console.log('📝 Registration request received:', {
                body: req.body,
                hasEmail: !!req.body.email,
                hasPassword: !!req.body.password,
                hasName: !!req.body.name
            });
            const { email, password, name, phone } = req.body;
            // Validate input
            if (!email || !password || !name) {
                console.log('❌ Validation failed:', { email: !!email, password: !!password, name: !!name });
                return res.status(400).json({
                    success: false,
                    message: 'Email, password, and name are required',
                    received: { hasEmail: !!email, hasPassword: !!password, hasName: !!name }
                });
            }
            // Check if user already exists
            const existingUser = await user_model_1.default.findUserByEmail(email);
            if (existingUser) {
                console.log('❌ User already exists:', email);
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }
            // Hash password
            console.log('🔐 Hashing password...');
            const hashedPassword = await (0, jwt_1.hashPassword)(password);
            // Create user with correct field name
            console.log('👤 Creating user in database...');
            const user = await user_model_1.default.createUser({
                email,
                passwordHash: hashedPassword,
                name,
                phone,
                provider: 'email',
                isVerified: false
            });
            console.log('✅ User created successfully:', user.id);
            // Generate auth response
            const authResponse = (0, jwt_1.generateAuthResponse)(user);
            // Set cookie
            res.cookie('auth_token', authResponse.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            console.log('✅ Registration successful for:', email);
            res.status(201).json({
                success: true,
                token: authResponse.token,
                user: authResponse.user
            });
        }
        catch (error) {
            console.error('❌ Registration error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            res.status(500).json({
                success: false,
                message: error.message || 'Registration failed',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Email/Password Login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }
            // Find user
            const user = await user_model_1.default.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            // Check if user is active
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Account is deactivated. Please contact support.'
                });
            }
            // Verify password
            if (!user.passwordHash) {
                return res.status(401).json({
                    success: false,
                    message: 'Please use OAuth to login (Google/Facebook)'
                });
            }
            const isPasswordValid = await (0, jwt_1.verifyPassword)(password, user.passwordHash);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            // Update last login (use supabaseAdmin to bypass RLS)
            await supabaseclient_1.supabaseAdmin
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', user.id);
            // Generate auth response
            const authResponse = (0, jwt_1.generateAuthResponse)(user);
            // Set cookie
            res.cookie('auth_token', authResponse.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({
                success: true,
                token: authResponse.token,
                user: authResponse.user
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Login failed'
            });
        }
    }
    // Initiate Google OAuth flow through Supabase
    async initiateGoogleOAuth(req, res) {
        const redirectTo = `${process.env.FRONTEND_URL}/auth/callback`;
        const supabaseOAuthURL = `${process.env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
        res.redirect(supabaseOAuthURL);
    }
    // Initiate Facebook OAuth flow through Supabase
    async initiateFacebookOAuth(req, res) {
        const redirectTo = `${process.env.FRONTEND_URL}/auth/callback`;
        const supabaseOAuthURL = `${process.env.SUPABASE_URL}/auth/v1/authorize?provider=facebook&redirect_to=${encodeURIComponent(redirectTo)}`;
        res.redirect(supabaseOAuthURL);
    }
    // Handle OAuth callback from Supabase
    async supabaseOAuthCallback(req, res) {
        try {
            // Receive OAuth user data from client after Supabase auth
            const { email, name, provider, providerId, avatar } = req.body;
            if (!email || !provider || !providerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required OAuth data'
                });
            }
            // Check if user exists by provider ID
            let user = await user_model_1.default.findUserByProvider(provider, providerId);
            if (!user) {
                // Check if user exists by email (for account merging)
                user = await user_model_1.default.findUserByEmail(email);
                if (user) {
                    // Update existing user with OAuth provider info
                    user = await user_model_1.default.updateUser(user.id, {
                        provider: provider,
                        providerId: providerId,
                        name: name || user.name,
                        avatarUrl: avatar || user.avatarUrl
                    });
                }
                else {
                    // Create new user
                    user = await user_model_1.default.createUser({
                        email: email,
                        name: name || 'User',
                        provider: provider,
                        providerId: providerId,
                        avatarUrl: avatar,
                        isVerified: true
                    });
                }
            }
            // Update last login (use supabaseAdmin to bypass RLS)
            await supabaseclient_1.supabaseAdmin
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', user.id);
            const authResponse = (0, jwt_1.generateAuthResponse)(user);
            res.cookie('auth_token', authResponse.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({
                success: true,
                token: authResponse.token,
                user: authResponse.user
            });
        }
        catch (error) {
            console.error('OAuth callback error:', error);
            res.status(500).json({
                success: false,
                message: 'OAuth authentication failed'
            });
        }
    }
    async getCurrentUser(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }
            const user = await user_model_1.default.getUserById(userId);
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
                    avatar: user.avatarUrl,
                    isVerified: user.isVerified,
                    provider: user.provider
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
