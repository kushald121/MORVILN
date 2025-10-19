import cloudinary from '../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export interface UploadResult {
  success: boolean;
  message?: string;
  data?: {
    public_id: string;
    url: string;
    secure_url: string;
    format: string;
    resource_type: string;
    width?: number;
    height?: number;
  };
}

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: any[];
  resource_type?: 'image' | 'video' | 'auto';
}

export class ImageService {
  /**
   * Upload file to Cloudinary
   */
  static async uploadFile(
    fileBuffer: Buffer,
    options: CloudinaryUploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const { folder = 'products', transformation = [], resource_type = 'auto' } = options;

      return new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type,
              folder,
              transformation: [
                { quality: 'auto', fetch_format: 'auto' },
                ...transformation,
              ],
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
              if (error) {
                resolve({
                  success: false,
                  message: error.message,
                });
              } else if (result) {
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
              } else {
                resolve({
                  success: false,
                  message: 'Unknown upload error',
                });
              }
            }
          )
          .end(fileBuffer);
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Upload multiple files
   */
  static async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; originalname: string }>,
    options: CloudinaryUploadOptions = {}
  ): Promise<Array<UploadResult & { filename: string }>> {
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
  static async deleteFile(publicId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        return { success: true };
      } else {
        return { success: false, message: result.result };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  /**
   * Generate optimized image URL with transformations
   */
  static generateOptimizedUrl(
    publicId: string,
    transformations: any[] = []
  ): string {
    const defaultTransformations = [
      { quality: 'auto', fetch_format: 'auto' },
      { width: 800, crop: 'limit' },
    ];

    const allTransformations = [...defaultTransformations, ...transformations];
    
    return cloudinary.url(publicId, {
      transformation: allTransformations,
    });
  }

  /**
   * Generate responsive image URLs for different screen sizes
   */
  static generateResponsiveUrls(publicId: string): {
    sm: string;  // 400px
    md: string;  // 800px  
    lg: string;  // 1200px
    xl: string;  // 1600px
    original: string;
  } {
    return {
      sm: cloudinary.url(publicId, {
        transformation: [
          { width: 400, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
      md: cloudinary.url(publicId, {
        transformation: [
          { width: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
      lg: cloudinary.url(publicId, {
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
      xl: cloudinary.url(publicId, {
        transformation: [
          { width: 1600, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
      original: cloudinary.url(publicId),
    };
  }

  /**
   * Generate product image URLs with specific transformations
   */
  static generateProductImageUrls(publicId: string): {
    thumbnail: string;
    gallery: string;
    zoom: string;
    main: string;
  } {
    return {
      thumbnail: cloudinary.url(publicId, {
        transformation: [
          { width: 100, height: 100, crop: 'fill' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
      gallery: cloudinary.url(publicId, {
        transformation: [
          { width: 500, height: 500, crop: 'fill' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
      zoom: cloudinary.url(publicId, {
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
      main: cloudinary.url(publicId, {
        transformation: [
          { width: 600, height: 600, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
    };
  }
}

export default ImageService;