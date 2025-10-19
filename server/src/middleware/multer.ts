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
        (allowedImageTypes.test(fileExtension) && mimetype.startsWith('image/')) ||
        (allowedVideoTypes.test(fileExtension) && mimetype.startsWith('video/'))
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
]);

export default upload;