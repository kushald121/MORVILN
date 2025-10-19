"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const image_service_1 = __importDefault(require("../services/image.service"));
class UploadController {
    /**
     * Upload single image
     */
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }
            const result = await image_service_1.default.uploadFile(req.file.buffer, {
                folder: 'products',
                transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            });
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                });
            }
            res.json({
                success: true,
                message: 'Image uploaded successfully',
                data: result.data,
                responsiveUrls: image_service_1.default.generateResponsiveUrls(result.data.public_id),
                productUrls: image_service_1.default.generateProductImageUrls(result.data.public_id),
            });
        }
        catch (error) {
            console.error('Upload image error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    /**
     * Upload multiple images
     */
    async uploadMultipleImages(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files uploaded',
                });
            }
            const files = req.files.map(file => ({
                buffer: file.buffer,
                originalname: file.originalname,
            }));
            const results = await image_service_1.default.uploadMultipleFiles(files, {
                folder: 'products',
            });
            const successfulUploads = results.filter(result => result.success);
            const failedUploads = results.filter(result => !result.success);
            res.json({
                success: true,
                message: `Uploaded ${successfulUploads.length} files successfully`,
                data: {
                    successful: successfulUploads.map(result => ({
                        filename: result.filename,
                        data: result.data,
                        responsiveUrls: result.data ? image_service_1.default.generateResponsiveUrls(result.data.public_id) : null,
                        productUrls: result.data ? image_service_1.default.generateProductImageUrls(result.data.public_id) : null,
                    })),
                    failed: failedUploads.map(result => ({
                        filename: result.filename,
                        error: result.message,
                    })),
                },
            });
        }
        catch (error) {
            console.error('Upload multiple images error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    /**
     * Delete image from Cloudinary
     */
    async deleteImage(req, res) {
        try {
            const { publicId } = req.params;
            if (!publicId) {
                return res.status(400).json({
                    success: false,
                    message: 'Public ID is required',
                });
            }
            const result = await image_service_1.default.deleteFile(publicId);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                });
            }
            res.json({
                success: true,
                message: 'Image deleted successfully',
            });
        }
        catch (error) {
            console.error('Delete image error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    /**
     * Generate optimized image URL
     */
    async generateOptimizedUrl(req, res) {
        try {
            const { publicId, width, height, crop = 'limit' } = req.body;
            if (!publicId) {
                return res.status(400).json({
                    success: false,
                    message: 'Public ID is required',
                });
            }
            const transformations = [];
            if (width)
                transformations.push({ width: parseInt(width), crop });
            if (height)
                transformations.push({ height: parseInt(height), crop });
            const optimizedUrl = image_service_1.default.generateOptimizedUrl(publicId, transformations);
            res.json({
                success: true,
                data: {
                    optimizedUrl,
                    publicId,
                    transformations: {
                        width: width || 'auto',
                        height: height || 'auto',
                        crop,
                    },
                },
            });
        }
        catch (error) {
            console.error('Generate optimized URL error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}
exports.UploadController = UploadController;
exports.default = new UploadController();
