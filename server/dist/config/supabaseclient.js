"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupabaseEnabled = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ ERROR: Missing Supabase credentials in .env file');
    console.error('   Required: SUPABASE_URL, SUPABASE_ANON_KEY');
    console.error('   Get them from: https://supabase.com/dashboard/project/_/settings/api');
}
const isSupabaseConfigured = !!(process.env.SUPABASE_URL &&
    process.env.SUPABASE_ANON_KEY &&
    process.env.SUPABASE_URL !== 'https://dummy.supabase.co');
if (isSupabaseConfigured) {
    console.log('✅ Supabase configured:', process.env.SUPABASE_URL);
}
else {
    console.warn('⚠️  Supabase not configured - using dummy instance');
}
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'https://dummy.supabase.co', process.env.SUPABASE_ANON_KEY || 'dummy-key');
exports.isSupabaseEnabled = isSupabaseConfigured;
exports.default = supabase;
