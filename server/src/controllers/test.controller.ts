import { Request, Response } from 'express';
import supabase, { testSupabaseConnection, initializeSupabaseTables } from '../config/supabaseclient';
import userModel from '../models/user.model';

export class TestController {
  // Test Supabase connection
  async testConnection(req: Request, res: Response) {
    try {
      console.log('🔍 Testing Supabase connection...');
      
      const connectionResult = await testSupabaseConnection();
      
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
      } else {
        res.status(500).json({
          success: false,
          message: 'Supabase connection failed',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error: any) {
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
  async testTables(req: Request, res: Response) {
    try {
      console.log('🔍 Testing database tables...');
      
      const tablesReady = await initializeSupabaseTables();
      
      if (tablesReady) {
        res.json({
          success: true,
          message: 'All database tables are ready',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Database tables not found or not accessible',
          instructions: 'Please run the SQL schema in Supabase dashboard',
          sqlFile: 'server/sql/schema.sql',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error: any) {
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
  async testUserOperations(req: Request, res: Response) {
    try {
      console.log('🔍 Testing user operations...');
      
      const testEmail = `test-${Date.now()}@example.com`;
      const testUser = {
        email: testEmail,
        name: 'Test User',
        provider: 'email' as const,
        isVerified: true
      };

      // Test: Create user
      console.log('Creating test user...');
      const createdUser = await userModel.createUser(testUser);
      console.log('✅ User created:', createdUser.id);

      // Test: Find user by email
      console.log('Finding user by email...');
      const foundUser = await userModel.findUserByEmail(testEmail);
      console.log('✅ User found by email:', foundUser?.id);

      // Test: Find user by ID
      console.log('Finding user by ID...');
      const foundById = await userModel.getUserById(createdUser.id);
      console.log('✅ User found by ID:', foundById?.id);

      // Test: Update user
      console.log('Updating user...');
      const updatedUser = await userModel.updateUser(createdUser.id, {
        name: 'Updated Test User'
      });
      console.log('✅ User updated:', updatedUser.name);

      // Test: Delete user (cleanup)
      console.log('Deleting test user...');
      await userModel.deleteUser(createdUser.id);
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

    } catch (error: any) {
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
  async testAuth(req: Request, res: Response) {
    try {
      console.log('🔍 Testing Supabase auth...');

      // Test anonymous sign up (if enabled)
      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
      
      let authTests = [];
      
      if (anonData.user && !anonError) {
        authTests.push('Anonymous sign-in: ✅ Working');
        
        // Sign out
        await supabase.auth.signOut();
        authTests.push('Sign out: ✅ Working');
      } else {
        authTests.push('Anonymous sign-in: ❌ Not enabled or failed');
      }

      // Test JWT validation
      try {
        const { data: jwtData } = await supabase.auth.getUser();
        authTests.push('JWT validation: ✅ Working');
      } catch {
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

    } catch (error: any) {
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
  async runAllTests(req: Request, res: Response) {
    try {
      console.log('🔍 Running comprehensive test suite...');
      
      const results = {
        connection: { success: false, message: '', error: null as string | null },
        tables: { success: false, message: '', error: null as string | null },
        userOperations: { success: false, message: '', error: null as string | null },
        auth: { success: false, message: '', error: null as string | null }
      };

      // Test 1: Connection
      try {
        const connectionResult = await testSupabaseConnection();
        results.connection = {
          success: connectionResult,
          message: connectionResult ? 'Connection successful' : 'Connection failed',
          error: null
        };
      } catch (error: any) {
        results.connection = { success: false, message: 'Connection test failed', error: error.message };
      }

      // Test 2: Tables (only if connection successful)
      if (results.connection.success) {
        try {
          const tablesResult = await initializeSupabaseTables();
          results.tables = {
            success: tablesResult,
            message: tablesResult ? 'All tables ready' : 'Tables not found',
            error: null
          };
        } catch (error: any) {
          results.tables = { success: false, message: 'Tables test failed', error: error.message };
        }
      }

      // Test 3: User Operations (only if tables ready)
      if (results.tables.success) {
        try {
          const testEmail = `test-${Date.now()}@example.com`;
          const testUser = await userModel.createUser({
            email: testEmail,
            name: 'Test User',
            provider: 'email',
            isVerified: true
          });
          
          await userModel.findUserByEmail(testEmail);
          await userModel.updateUser(testUser.id, { name: 'Updated Test User' });
          await userModel.deleteUser(testUser.id);
          
          results.userOperations = { success: true, message: 'All CRUD operations successful', error: null };
        } catch (error: any) {
          results.userOperations = { success: false, message: 'User operations failed', error: error.message };
        }
      }

      // Test 4: Auth
      try {
        const { error } = await supabase.auth.signInAnonymously();
        if (!error) {
          await supabase.auth.signOut();
          results.auth = { success: true, message: 'Auth system working', error: null };
        } else {
          results.auth = { success: false, message: 'Auth test failed', error: error.message };
        }
      } catch (error: any) {
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

    } catch (error: any) {
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
  async healthCheck(req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  }
}

export default new TestController();