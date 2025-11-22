"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = __importDefault(require("../controllers/products.controller"));
const router = (0, express_1.Router)();
// SEO-friendly product routes
router.get('/categories', products_controller_1.default.getCategories);
router.get('/:category', products_controller_1.default.getProductsByCategory);
router.get('/:category/:slug', products_controller_1.default.getProductBySlug);
exports.default = router;
