"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
console.log('🔍 Loading product detail routes...');
// Public routes (no authentication required)
router.get('/', product_controller_1.ProductController.getProducts);
router.get('/featured', product_controller_1.ProductController.getFeaturedProducts);
router.get('/categories', product_controller_1.ProductController.getCategories);
router.get('/search', product_controller_1.ProductController.searchProducts);
router.get('/availability/:variantId', product_controller_1.ProductController.checkAvailability);
router.get('/:identifier', product_controller_1.ProductController.getProduct); // Must be last to avoid conflicts
console.log('✅ Product detail routes loaded');
exports.default = router;
