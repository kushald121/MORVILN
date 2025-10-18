import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Define the allowed MIME types and extensions
const allowedImageTypes = /jpeg|jpg|png|webp/;
const allowedVideoTypes = /mp4|mov|avi|webm/;

// File filter function with TypeScript types
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (
        allowedImageTypes.test(fileExtension) && mimetype.startsWith('image/') ||
        allowedVideoTypes.test(fileExtension) && mimetype.startsWith('video/')
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only Images (jpeg, jpg, png, webp) and Videos (mp4, mov, avi, webm) are allowed"));
    }
};

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// 80MB max for video uploads
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 80 * 1024 * 1024 } // 80 MB limit
});

// Disk storage configuration with TypeScript types
const diskStorage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, "./public/uploads");
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        const fileExtension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExtension).replace(/\s+/g, '-').toLowerCase();
        cb(null, `${baseName}-${Date.now()}${fileExtension}`);
    }
});

// Keep the old disk storage for backward compatibility if needed
export const uploadToDisk = multer({
    storage: diskStorage,
    fileFilter,
    limits: { fileSize: 80 * 1024 * 1024 } // 80 MB limit
});

// Additional utility functions with TypeScript

export interface UploadLimits {
    fileSize: number;
    files?: number;
}

export const createUploadMiddleware = (limits?: UploadLimits) => {
    return multer({
        storage,
        fileFilter,
        limits: limits || { fileSize: 80 * 1024 * 1024 }
    });
};

// Single file upload instances
export const uploadSingleImage = upload.single('image');
export const uploadSingleVideo = upload.single('video');
export const uploadSingleFile = upload.single('file');

// Multiple files upload instances
export const uploadMultipleImages = upload.array('images', 10); // max 10 images
export const uploadMultipleVideos = upload.array('videos', 5); // max 5 videos
export const uploadMultipleFiles = upload.array('files', 15); // max 15 files

// Mixed file types
export const uploadMixedFiles = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 3 },
    { name: 'documents', maxCount: 5 }
]);

// Type definitions for file validation
export interface FileValidationOptions {
    maxFileSize?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
}

export const createCustomFileFilter = (options: FileValidationOptions) => {
    return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const maxSize = options.maxFileSize || 80 * 1024 * 1024;

        // Check file size
        if (file.size > maxSize) {
            return cb(new Error(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`));
        }

        // Check MIME type if provided
        if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
            if (!options.allowedMimeTypes.includes(file.mimetype)) {
                return cb(new Error(`Invalid file type. Allowed types: ${options.allowedMimeTypes.join(', ')}`));
            }
        }

        // Check file extension if provided
        if (options.allowedExtensions && options.allowedExtensions.length > 0) {
            const ext = fileExtension.replace('.', '');
            if (!options.allowedExtensions.includes(ext)) {
                return cb(new Error(`Invalid file extension. Allowed extensions: ${options.allowedExtensions.join(', ')}`));
            }
        }

        cb(null, true);
    };
};

// Custom upload instance with specific options
export const createCustomUpload = (options: FileValidationOptions & { storage?: multer.StorageEngine }) => {
    const customFileFilter = createCustomFileFilter(options);
    
    return multer({
        storage: options.storage || storage,
        fileFilter: customFileFilter,
        limits: { fileSize: options.maxFileSize || 80 * 1024 * 1024 }
    });
};

// Error handling middleware for multer
export const handleMulterError = (error: any, req: Request, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 80MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files uploaded.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name for file upload.'
            });
        }
    }
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next();
};

export default upload;