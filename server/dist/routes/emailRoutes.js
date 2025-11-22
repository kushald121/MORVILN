"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = __importDefault(require("../controllers/email.controller"));
const router = (0, express_1.Router)();
// Test routes
router.get('/test-connection', email_controller_1.default.testConnection);
router.post('/test-send', email_controller_1.default.sendTestEmail);
// Template-based email routes
router.post('/order-confirmation', email_controller_1.default.sendOrderConfirmation);
router.post('/product-launch', email_controller_1.default.sendProductLaunch);
router.post('/custom-offer', email_controller_1.default.sendCustomOffer);
router.post('/welcome', email_controller_1.default.sendWelcomeEmail);
router.post('/password-reset', email_controller_1.default.sendPasswordResetEmail);
router.post('/admin-order-notification', email_controller_1.default.sendAdminOrderNotification);
// Verification route
router.get('/verify', email_controller_1.default.verifyEmailService);
exports.default = router;
