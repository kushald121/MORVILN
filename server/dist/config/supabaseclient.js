"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupabaseEnabled = exports.initializeSupabaseTables = exports.testSupabaseConnection = exports.supabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ ERROR: Missing Supabase credentials in .env file');
    console.error('   Required: SUPABASE_URL, SUPABASE_ANON_KEY');
    console.error('   Get them from: https://supabase.com/dashboard/project/_/settings/api');
    throw new Error('Missing Supabase configuration');
}
// Validate URL format
const urlPattern = /^https:\/\/[a-z0-9]+\.supabase\.co$/;
if (!urlPattern.test(process.env.SUPABASE_URL)) {
    console.error('❌ ERROR: Invalid SUPABASE_URL format');
    console.error('   Expected format: https://your-project-id.supabase.co');
    console.error('   Received:', process.env.SUPABASE_URL);
    throw new Error('Invalid SUPABASE_URL format');
}
const isSupabaseConfigured = !!(process.env.SUPABASE_URL &&
    process.env.SUPABASE_ANON_KEY);
console.log('✅ Supabase client configured:', process.env.SUPABASE_URL);
// Create Supabase client with proper configuration
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: false, // Server-side usage
        detectSessionInUrl: false,
    },
    global: {
        headers: {
            'x-client-version': '2.0.0',
        },
    },
});
// Create admin client for server-side operations (if service role key is available)
exports.supabaseAdmin = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
// Test connection function
const testSupabaseConnection = async () => {
    try {
        console.log('🔄 Testing Supabase connection...');
        // Test basic connectivity
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.error('❌ Supabase connection test failed:', error.message);
            return false;
        }
        console.log('✅ Supabase connection test successful');
        return true;
    }
    catch (error) {
        console.error('❌ Supabase connection test error:', error);
        return false;
    }
};
exports.testSupabaseConnection = testSupabaseConnection;
// Initialize Supabase tables if they don't exist
const initializeSupabaseTables = async () => {
    try {
        console.log('🔄 Checking Supabase tables...');
        // Test if users table exists by trying to select from it
        const { error } = await supabase.from('users').select('id').limit(1);
        if (error && error.code === 'PGRST116') {
            console.log('⚠️  Tables not found. Please run the SQL setup in Supabase dashboard.');
            console.log('   Go to: Project Dashboard → SQL Editor');
            console.log('   Copy the SQL from server/sql/schema.sql and run it');
            return false;
        }
        else if (error) {
            console.error('❌ Error checking tables:', error.message);
            return false;
        }
        console.log('✅ Supabase tables are ready');
        return true;
    }
    catch (error) {
        console.error('❌ Error initializing Supabase tables:', error);
        return false;
    }
};
exports.initializeSupabaseTables = initializeSupabaseTables;
exports.isSupabaseEnabled = isSupabaseConfigured;
exports.default = supabase;
