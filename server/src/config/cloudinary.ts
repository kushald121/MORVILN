import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️  WARNING: Missing Cloudinary credentials in .env file');
  console.warn('   Image uploads will not work without: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy-cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy-secret',
  secure: true,
});

export default cloudinary;
