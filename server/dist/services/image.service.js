"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
class ImageService {
    /**
     * Upload file to Cloudinary
     */
    static async uploadFile(fileBuffer, options = {}) {
        try {
            const { folder = 'products', transformation = [], resource_type = 'auto' } = options;
            return new Promise((resolve) => {
                cloudinary_1.default.uploader
                    .upload_stream({
                    resource_type,
                    folder,
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' },
                        ...transformation,
                    ],
                }, (error, result) => {
                    if (error) {
                        resolve({
                            success: false,
                            message: error.message,
                        });
                    }
                    else if (result) {
                        resolve({
                            success: true,
                            data: {
                                public_id: result.public_id,
                                url: result.url,
                                secure_url: result.secure_url,
                                format: result.format,
                                resource_type: result.resource_type,
                                width: result.width,
                                height: result.height,
                            },
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            message: 'Unknown upload error',
                        });
                    }
                })
                    .end(fileBuffer);
            });
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Upload failed',
            };
        }
    }
    /**
     * Upload multiple files
     */
    static async uploadMultipleFiles(files, options = {}) {
        const uploadPromises = files.map(async (file) => {
            const result = await this.uploadFile(file.buffer, options);
            return {
                ...result,
                filename: file.originalname,
            };
        });
        return Promise.all(uploadPromises);
    }
    /**
     * Delete file from Cloudinary
     */
    static async deleteFile(publicId) {
        try {
            const result = await cloudinary_1.default.uploader.destroy(publicId);
            if (result.result === 'ok') {
                return { success: true };
            }
            else {
                return { success: false, message: result.result };
            }
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Delete failed',
            };
        }
    }
    /**
     * Generate optimized image URL with transformations
     */
    static generateOptimizedUrl(publicId, transformations = []) {
        const defaultTransformations = [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 800, crop: 'limit' },
        ];
        const allTransformations = [...defaultTransformations, ...transformations];
        return cloudinary_1.default.url(publicId, {
            transformation: allTransformations,
        });
    }
    /**
     * Generate responsive image URLs for different screen sizes
     */
    static generateResponsiveUrls(publicId) {
        return {
            sm: cloudinary_1.default.url(publicId, {
                transformation: [
                    { width: 400, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }),
            md: cloudinary_1.default.url(publicId, {
                transformation: [
                    { width: 800, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }),
            lg: cloudinary_1.default.url(publicId, {
                transformation: [
                    { width: 1200, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }),
            xl: cloudinary_1.default.url(publicId, {
                transformation: [
                    { width: 1600, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }),
            original: cloudinary_1.default.url(publicId),
        };
    }
    /**
     * Generate product image URLs with specific transformations
     */
    static generateProductImageUrls(publicId) {
        return {
            thumbnail: cloudinary_1.default.url(publicId, {
                transformation: [
                    { width: 100, height: 100, crop: 'fill' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }),
            gallery: cloudinary_1.default.url(publicId, {
                transformation: [
                    { width: 500, height: 500, crop: 'fill' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }),
            zoom: cloudinary_1.default.url(publicId, {
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }),
            main: cloudinary_1.default.url(publicId, {
                transformation: [
                    { width: 600, height: 600, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            }),
        };
    }
}
exports.ImageService = ImageService;
exports.default = ImageService;
