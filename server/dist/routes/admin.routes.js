"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = __importDefault(require("../controllers/products.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin role
router.use(auth_middleware_1.authMiddleware);
router.use(admin_middleware_1.adminMiddleware);
// Product management routes
router.post('/products', products_controller_1.default.createProduct);
router.get('/products', products_controller_1.default.getProducts);
router.get('/products/:id', products_controller_1.default.getProduct);
router.put('/products/:id', products_controller_1.default.updateProduct);
router.delete('/products/:id', products_controller_1.default.deleteProduct);
router.patch('/products/:id/status', products_controller_1.default.toggleProductStatus);
exports.default = router;
