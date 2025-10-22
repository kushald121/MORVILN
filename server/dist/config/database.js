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
exports.initializeDatabase = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const supabaseclient_1 = __importStar(require("./supabaseclient"));
dotenv_1.default.config();
console.log('✅ Using Supabase client for database operations');
// Initialize Supabase database connection and check tables
const initializeDatabase = async () => {
    console.log('🔄 Initializing Supabase connection...');
    try {
        // Test Supabase connection
        const connectionTest = await (0, supabaseclient_1.testSupabaseConnection)();
        if (!connectionTest) {
            throw new Error('Supabase connection failed');
        }
        // Check if tables exist and are properly set up
        const tablesReady = await (0, supabaseclient_1.initializeSupabaseTables)();
        if (!tablesReady) {
            console.log('📝 SQL Schema needed. Please run this SQL in your Supabase dashboard:');
            console.log('   Go to: Project Dashboard → SQL Editor → New Query');
            console.log('   Copy and execute the SQL from: server/sql/schema.sql');
            return false;
        }
        console.log('✅ Supabase database initialized successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Supabase database initialization failed:', error.message);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
// Export supabase client as default for backward compatibility
exports.default = supabaseclient_1.default;
