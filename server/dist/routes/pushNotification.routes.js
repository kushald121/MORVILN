"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fcm_controller_1 = __importDefault(require("../controllers/fcm.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register-token', auth_middleware_1.authMiddleware, fcm_controller_1.default.registerToken);
router.post('/unregister-token', auth_middleware_1.authMiddleware, fcm_controller_1.default.unregisterToken);
router.post('/send', auth_middleware_1.authMiddleware, fcm_controller_1.default.sendNotification);
router.post('/send-all', auth_middleware_1.authMiddleware, fcm_controller_1.default.sendToAll);
router.post('/test', auth_middleware_1.authMiddleware, fcm_controller_1.default.testNotification);
router.get('/notifications', auth_middleware_1.authMiddleware, fcm_controller_1.default.getNotifications);
router.put('/notifications/:notificationId/read', auth_middleware_1.authMiddleware, fcm_controller_1.default.markAsRead);
router.put('/notifications/read-all', auth_middleware_1.authMiddleware, fcm_controller_1.default.markAllAsRead);
router.post('/webhook/supabase', fcm_controller_1.default.supabaseWebhook);
exports.default = router;
