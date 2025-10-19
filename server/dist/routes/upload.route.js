"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = __importDefault(require("../controllers/upload.controller"));
const multer_1 = require("../middleware/multer");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Image upload routes (protected)
router.post('/image', auth_middleware_1.authMiddleware, multer_1.uploadSingleImage, upload_controller_1.default.uploadImage);
router.post('/images', auth_middleware_1.authMiddleware, multer_1.uploadMultipleImages, upload_controller_1.default.uploadMultipleImages);
router.delete('/:publicId', auth_middleware_1.authMiddleware, upload_controller_1.default.deleteImage);
router.post('/optimize-url', upload_controller_1.default.generateOptimizedUrl);
exports.default = router;
