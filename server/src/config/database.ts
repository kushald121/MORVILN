import dotenv from 'dotenv';
import supabase, { testSupabaseConnection, initializeSupabaseTables } from './supabaseclient';

dotenv.config();

console.log('✅ Using Supabase client for database operations');

// Initialize Supabase database connection and check tables
export const initializeDatabase = async () => {
  console.log('🔄 Initializing Supabase connection...');
  
  try {
    // Test Supabase connection
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest) {
      throw new Error('Supabase connection failed');
    }

    // Check if tables exist and are properly set up
    const tablesReady = await initializeSupabaseTables();
    if (!tablesReady) {
      console.log('📝 SQL Schema needed. Please run this SQL in your Supabase dashboard:');
      console.log('   Go to: Project Dashboard → SQL Editor → New Query');
      console.log('   Copy and execute the SQL from: server/sql/schema.sql');
      return false;
    }

    console.log('✅ Supabase database initialized successfully');
    return true;
  } catch (error: any) {
    console.error('❌ Supabase database initialization failed:', error.message);
    throw error;
  }
};

// Export supabase client as default for backward compatibility
export default supabase;
