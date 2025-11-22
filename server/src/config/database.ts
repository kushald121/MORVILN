import dotenv from 'dotenv';
import supabase, { testSupabaseConnection, initializeSupabaseTables, isSupabaseEnabled } from './supabaseclient';

dotenv.config();

if (isSupabaseEnabled) {
  console.log('✅ Using Supabase client for database operations');
} else {
  console.log('⚠️ Supabase not configured - using minimal database setup');
}

// Initialize Supabase database connection and check tables
export const initializeDatabase = async () => {
  console.log('🔄 Initializing database connection...');
  
  // If Supabase is not enabled, skip initialization
  if (!isSupabaseEnabled) {
    console.log('⚠️ Supabase not configured - skipping database initialization');
    return Promise.resolve(true);
  }
  
  try {
    // Test Supabase connection
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest) {
      console.log('⚠️ Supabase connection failed - continuing with limited functionality');
      return Promise.resolve(false);
    }

    // Check if tables exist and are properly set up
    const tablesReady = await initializeSupabaseTables();
    if (!tablesReady) {
      console.log('📝 SQL Schema needed. Please run this SQL in your Supabase dashboard:');
      console.log('   Go to: Project Dashboard → SQL Editor → New Query');
      console.log('   Copy and execute the SQL from: server/sql/schema.sql');
      return Promise.resolve(false);
    }

    console.log('✅ Supabase database initialized successfully');
    return Promise.resolve(true);
  } catch (error: any) {
    console.error('❌ Supabase database initialization failed:', error.message);
    console.log('⚠️ Continuing with limited functionality');
    return Promise.resolve(false);
  }
};

// Export supabase client as default for backward compatibility
export default supabase;