"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_push_1 = __importDefault(require("web-push"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn('⚠️  WARNING: VAPID keys not configured in .env');
    console.warn('   Generate keys with: npx web-push generate-vapid-keys');
    console.warn('   Push notifications will not work without VAPID keys');
}
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    web_push_1.default.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:admin@morviln.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    console.log('✅ Web Push configured with VAPID keys');
}
exports.default = web_push_1.default;
