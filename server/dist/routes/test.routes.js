"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = __importDefault(require("../controllers/test.controller"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', test_controller_1.default.healthCheck);
// Individual tests
router.get('/connection', test_controller_1.default.testConnection);
router.get('/tables', test_controller_1.default.testTables);
router.get('/user-operations', test_controller_1.default.testUserOperations);
router.get('/auth', test_controller_1.default.testAuth);
// Comprehensive test suite
router.get('/all', test_controller_1.default.runAllTests);
exports.default = router;
