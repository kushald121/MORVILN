"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const router = (0, express_1.Router)();
// Admin login - NO authentication required
router.post('/login', admin_controller_1.default.adminLogin.bind(admin_controller_1.default));
exports.default = router;
