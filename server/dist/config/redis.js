"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRedisEnabled = exports.redis = void 0;
const redis_1 = require("@upstash/redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('⚠️  WARNING: Missing Redis credentials in .env file');
    console.warn('   Redis features will not work without: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN');
}
exports.redis = new redis_1.Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy-url.upstash.io',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy-token',
});
exports.isRedisEnabled = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
exports.default = exports.redis;
