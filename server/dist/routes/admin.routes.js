"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = __importDefault(require("../controllers/products.controller"));
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin role
router.use(auth_middleware_1.authMiddleware);
router.use(admin_middleware_1.adminMiddleware);
// Dashboard stats
router.get('/stats', admin_controller_1.default.getStats.bind(admin_controller_1.default));
// Product management routes
router.post('/products', multer_1.upload.array('media', 10), admin_controller_1.default.createProductWithUpload.bind(admin_controller_1.default));
router.get('/products', products_controller_1.default.getProducts);
router.get('/products/:id', products_controller_1.default.getProduct);
router.put('/products/:id', products_controller_1.default.updateProduct);
router.delete('/products/:id', products_controller_1.default.deleteProduct);
router.patch('/products/:id/status', products_controller_1.default.toggleProductStatus);
// Bulk operations
router.put('/products/bulk', admin_controller_1.default.bulkUpdateProducts.bind(admin_controller_1.default));
router.delete('/products/bulk', admin_controller_1.default.bulkDeleteProducts.bind(admin_controller_1.default));
// Orders management
router.get('/orders', admin_controller_1.default.getAllOrders.bind(admin_controller_1.default));
router.put('/orders/:id/status', admin_controller_1.default.updateOrderStatus.bind(admin_controller_1.default));
exports.default = router;
