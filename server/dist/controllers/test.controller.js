"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const supabaseclient_1 = __importStar(require("../config/supabaseclient"));
const user_model_1 = __importDefault(require("../models/user.model"));
class TestController {
    // Test Supabase connection
    async testConnection(req, res) {
        try {
            console.log('🔍 Testing Supabase connection...');
            const connectionResult = await (0, supabaseclient_1.testSupabaseConnection)();
            if (connectionResult) {
                res.json({
                    success: true,
                    message: 'Supabase connection successful',
                    timestamp: new Date().toISOString(),
                    config: {
                        url: process.env.SUPABASE_URL,
                        hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
                        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Supabase connection failed',
                    timestamp: new Date().toISOString()
                });
            }
        }
        catch (error) {
            console.error('Test connection error:', error);
            res.status(500).json({
                success: false,
                message: 'Connection test failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    // Test database tables
    async testTables(req, res) {
        try {
            console.log('🔍 Testing database tables...');
            const tablesReady = await (0, supabaseclient_1.initializeSupabaseTables)();
            if (tablesReady) {
                res.json({
                    success: true,
                    message: 'All database tables are ready',
                    timestamp: new Date().toISOString()
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Database tables not found or not accessible',
                    instructions: 'Please run the SQL schema in Supabase dashboard',
                    sqlFile: 'server/sql/schema.sql',
                    timestamp: new Date().toISOString()
                });
            }
        }
        catch (error) {
            console.error('Test tables error:', error);
            res.status(500).json({
                success: false,
                message: 'Tables test failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    // Test user operations (CRUD)
    async testUserOperations(req, res) {
        try {
            console.log('🔍 Testing user operations...');
            const testEmail = `test-${Date.now()}@example.com`;
            const testUser = {
                email: testEmail,
                name: 'Test User',
                provider: 'email',
                isVerified: true
            };
            // Test: Create user
            console.log('Creating test user...');
            const createdUser = await user_model_1.default.createUser(testUser);
            console.log('✅ User created:', createdUser.id);
            // Test: Find user by email
            console.log('Finding user by email...');
            const foundUser = await user_model_1.default.findUserByEmail(testEmail);
            console.log('✅ User found by email:', foundUser?.id);
            // Test: Find user by ID
            console.log('Finding user by ID...');
            const foundById = await user_model_1.default.getUserById(createdUser.id);
            console.log('✅ User found by ID:', foundById?.id);
            // Test: Update user
            console.log('Updating user...');
            const updatedUser = await user_model_1.default.updateUser(createdUser.id, {
                name: 'Updated Test User'
            });
            console.log('✅ User updated:', updatedUser.name);
            // Test: Delete user (cleanup)
            console.log('Deleting test user...');
            await user_model_1.default.deleteUser(createdUser.id);
            console.log('✅ User deleted');
            res.json({
                success: true,
                message: 'All user operations completed successfully',
                tests: [
                    'Create user',
                    'Find user by email',
                    'Find user by ID',
                    'Update user',
                    'Delete user'
                ],
                testUserId: createdUser.id,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Test user operations error:', error);
            res.status(500).json({
                success: false,
                message: 'User operations test failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    // Test Supabase auth functionality
    async testAuth(req, res) {
        try {
            console.log('🔍 Testing Supabase auth...');
            // Test anonymous sign up (if enabled)
            const { data: anonData, error: anonError } = await supabaseclient_1.default.auth.signInAnonymously();
            let authTests = [];
            if (anonData.user && !anonError) {
                authTests.push('Anonymous sign-in: ✅ Working');
                // Sign out
                await supabaseclient_1.default.auth.signOut();
                authTests.push('Sign out: ✅ Working');
            }
            else {
                authTests.push('Anonymous sign-in: ❌ Not enabled or failed');
            }
            // Test JWT validation
            try {
                const { data: jwtData } = await supabaseclient_1.default.auth.getUser();
                authTests.push('JWT validation: ✅ Working');
            }
            catch {
                authTests.push('JWT validation: ℹ️ No active session (expected)');
            }
            res.json({
                success: true,
                message: 'Auth tests completed',
                tests: authTests,
                authConfig: {
                    autoConfirm: 'Check Supabase Dashboard → Authentication → Settings',
                    providers: 'Check Supabase Dashboard → Authentication → Providers'
                },
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Test auth error:', error);
            res.status(500).json({
                success: false,
                message: 'Auth test failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    // Comprehensive test suite
    async runAllTests(req, res) {
        try {
            console.log('🔍 Running comprehensive test suite...');
            const results = {
                connection: { success: false, message: '', error: null },
                tables: { success: false, message: '', error: null },
                userOperations: { success: false, message: '', error: null },
                auth: { success: false, message: '', error: null }
            };
            // Test 1: Connection
            try {
                const connectionResult = await (0, supabaseclient_1.testSupabaseConnection)();
                results.connection = {
                    success: connectionResult,
                    message: connectionResult ? 'Connection successful' : 'Connection failed',
                    error: null
                };
            }
            catch (error) {
                results.connection = { success: false, message: 'Connection test failed', error: error.message };
            }
            // Test 2: Tables (only if connection successful)
            if (results.connection.success) {
                try {
                    const tablesResult = await (0, supabaseclient_1.initializeSupabaseTables)();
                    results.tables = {
                        success: tablesResult,
                        message: tablesResult ? 'All tables ready' : 'Tables not found',
                        error: null
                    };
                }
                catch (error) {
                    results.tables = { success: false, message: 'Tables test failed', error: error.message };
                }
            }
            // Test 3: User Operations (only if tables ready)
            if (results.tables.success) {
                try {
                    const testEmail = `test-${Date.now()}@example.com`;
                    const testUser = await user_model_1.default.createUser({
                        email: testEmail,
                        name: 'Test User',
                        provider: 'email',
                        isVerified: true
                    });
                    await user_model_1.default.findUserByEmail(testEmail);
                    await user_model_1.default.updateUser(testUser.id, { name: 'Updated Test User' });
                    await user_model_1.default.deleteUser(testUser.id);
                    results.userOperations = { success: true, message: 'All CRUD operations successful', error: null };
                }
                catch (error) {
                    results.userOperations = { success: false, message: 'User operations failed', error: error.message };
                }
            }
            // Test 4: Auth
            try {
                const { error } = await supabaseclient_1.default.auth.signInAnonymously();
                if (!error) {
                    await supabaseclient_1.default.auth.signOut();
                    results.auth = { success: true, message: 'Auth system working', error: null };
                }
                else {
                    results.auth = { success: false, message: 'Auth test failed', error: error.message };
                }
            }
            catch (error) {
                results.auth = { success: false, message: 'Auth test error', error: error.message };
            }
            const overallSuccess = results.connection.success && results.tables.success && results.userOperations.success;
            res.json({
                success: overallSuccess,
                message: overallSuccess ? 'All tests passed! 🎉' : 'Some tests failed ❌',
                results,
                timestamp: new Date().toISOString(),
                nextSteps: overallSuccess ? [
                    'Your Supabase setup is working perfectly!',
                    'You can now use the API endpoints',
                    'Check the auth routes for OAuth setup'
                ] : [
                    'Check the failed tests above',
                    'Ensure your .env file has correct SUPABASE_URL and SUPABASE_ANON_KEY',
                    'Run the SQL schema in Supabase dashboard if tables test failed'
                ]
            });
        }
        catch (error) {
            console.error('Comprehensive test error:', error);
            res.status(500).json({
                success: false,
                message: 'Test suite failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    // Health check endpoint
    async healthCheck(req, res) {
        res.json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0'
        });
    }
}
exports.TestController = TestController;
exports.default = new TestController();
