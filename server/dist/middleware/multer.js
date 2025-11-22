"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMixedFiles = exports.uploadMultipleFiles = exports.uploadMultipleVideos = exports.uploadMultipleImages = exports.uploadSingleFile = exports.uploadSingleVideo = exports.uploadSingleImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Define the allowed MIME types and extensions
const allowedImageTypes = /jpeg|jpg|png|webp/;
const allowedVideoTypes = /mp4|mov|avi|webm/;
// File filter function with TypeScript types
const fileFilter = (req, file, cb) => {
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    if ((allowedImageTypes.test(fileExtension) && mimetype.startsWith('image/')) ||
        (allowedVideoTypes.test(fileExtension) && mimetype.startsWith('video/'))) {
        cb(null, true);
    }
    else {
        cb(new Error("Only Images (jpeg, jpg, png, webp) and Videos (mp4, mov, avi, webm) are allowed"));
    }
};
// Use memory storage for Cloudinary uploads
const storage = multer_1.default.memoryStorage();
// 80MB max for video uploads
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 80 * 1024 * 1024 } // 80 MB limit
});
// Single file upload instances
exports.uploadSingleImage = exports.upload.single('image');
exports.uploadSingleVideo = exports.upload.single('video');
exports.uploadSingleFile = exports.upload.single('file');
// Multiple files upload instances
exports.uploadMultipleImages = exports.upload.array('images', 10); // max 10 images
exports.uploadMultipleVideos = exports.upload.array('videos', 5); // max 5 videos
exports.uploadMultipleFiles = exports.upload.array('files', 15); // max 15 files
// Mixed file types
exports.uploadMixedFiles = exports.upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 3 },
]);
exports.default = exports.upload;
