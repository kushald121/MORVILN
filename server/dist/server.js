"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables first
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, database_1.initializeDatabase)();
    }
    catch (error) {
        console.error('Warning: Database initialization failed:', error);
        console.log('Continuing with limited functionality...');
    }
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`📧 Email routes: http://localhost:${PORT}/api/email`);
        console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
        console.log(`💳 Payment routes: http://localhost:${PORT}/api/payments`);
    });
};
startServer();
