"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️  WARNING: Missing Cloudinary credentials in .env file');
    console.warn('   Image uploads will not work without: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy-cloud',
    api_key: process.env.CLOUDINARY_API_KEY || 'dummy-key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy-secret',
    secure: true,
});
exports.default = cloudinary_1.v2;
