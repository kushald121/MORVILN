"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailConnection = exports.emailConfig = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create Gmail transporter
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // Use STARTTLS
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});
// Validate required environment variables
if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error('❌ Missing required Gmail SMTP environment variables');
    console.error('Required: SMTP_EMAIL, SMTP_PASSWORD');
    console.error('💡 Make sure to use Gmail App Password, not regular password');
    process.exit(1);
}
// Email configuration
exports.emailConfig = {
    from: process.env.SMTP_EMAIL,
    fromName: process.env.FROM_NAME || 'Your App',
};
// Test connection function
const testEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Gmail SMTP connection verified successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Gmail SMTP connection failed:', error);
        console.error('💡 Common issues:');
        console.error('   - Use Gmail App Password instead of regular password');
        console.error('   - Enable 2-Factor Authentication on Gmail');
        console.error('   - Check if Less Secure Apps is enabled (if not using App Password)');
        return false;
    }
};
exports.testEmailConnection = testEmailConnection;
exports.default = transporter;
