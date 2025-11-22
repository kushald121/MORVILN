"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const magicLink_controller_1 = __importDefault(require("../controllers/magicLink.controller"));
const router = (0, express_1.Router)();
router.post('/send', magicLink_controller_1.default.sendMagicLink);
router.post('/verify', magicLink_controller_1.default.verifyMagicLink);
router.post('/verify-otp', magicLink_controller_1.default.verifyOTP);
exports.default = router;
