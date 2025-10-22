"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
class UploadController {
    /**
     * Upload single image
     */
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }
            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    resource_type: 'image',
                    folder: 'fashion-store/products',
                    quality: 'auto',
                    fetch_format: 'auto'
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(req.file.buffer);
            });
            res.json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height
                }
            });
        }
        catch (error) {
            console.error('Upload image error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to upload image'
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
                    message: 'No files uploaded'
                });
            }
            const files = req.files;
            const uploadResults = [];
            for (const file of files) {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.default.uploader.upload_stream({
                        resource_type: 'image',
                        folder: 'fashion-store/products',
                        quality: 'auto',
                        fetch_format: 'auto'
                    }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    uploadStream.end(file.buffer);
                });
                uploadResults.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height
                });
            }
            res.json({
                success: true,
                message: 'Images uploaded successfully',
                data: uploadResults
            });
        }
        catch (error) {
            console.error('Upload multiple images error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to upload images'
            });
        }
    }
    /**
     * Delete image from Cloudinary
     */
    async deleteImage(req, res) {
        try {
            const { publicId } = req.params;
            const result = await cloudinary_1.default.uploader.destroy(publicId);
            if (result.result === 'ok') {
                res.json({
                    success: true,
                    message: 'Image deleted successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Failed to delete image'
                });
            }
        }
        catch (error) {
            console.error('Delete image error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete image'
            });
        }
    }
    /**
     * Generate optimized URL for images
     */
    async generateOptimizedUrl(req, res) {
        try {
            const { publicId, width = 600, height = 600 } = req.body;
            if (!publicId) {
                return res.status(400).json({
                    success: false,
                    message: 'Public ID is required'
                });
            }
            const url = cloudinary_1.default.url(publicId, {
                width,
                height,
                crop: 'fill',
                quality: 'auto',
                fetch_format: 'auto'
            });
            res.json({
                success: true,
                data: { url }
            });
        }
        catch (error) {
            console.error('Generate optimized URL error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate optimized URL'
            });
        }
    }
}
exports.UploadController = UploadController;
exports.default = new UploadController();
