"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = (0, express_1.Router)();
router.get('/signature', (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary_1.default.utils.api_sign_request({
            timestamp: timestamp,
        }, process.env.CLOUDINARY_API_SECRET);
        res.json({
            signature,
            timestamp,
            cloudname: process.env.CLOUDINARY_CLOUD_NAME,
            apikey: process.env.CLOUDINARY_API_KEY,
        });
    }
    catch (error) {
        console.error('Error generating signature:', error);
        res.status(500).json({ error: 'Error generating signature' });
    }
});
exports.default = router;
