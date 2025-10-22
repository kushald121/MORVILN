import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

console.log('Cloudinary environment variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️  WARNING: Missing Cloudinary credentials in .env file');
  console.warn('   Image uploads will not work without: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy-cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy-secret',
  secure: true,
};

console.log('Cloudinary config:', config);

cloudinary.config(config);

export default cloudinary;