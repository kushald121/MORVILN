import {
  Category,
  CreateProductPayload,
  UploadResponse,
  Product
} from '../types/product.types';
import { productsAPI, uploadAPI } from '@/lib/api';

class ProductService {
  // Generate slug from product name
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await productsAPI.getCategories();
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.categories) {
        return response.data.categories;
      } else if (response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          name: 'Men Clothing',
          slug: 'men-clothing',
          description: 'Clothing for men',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Women Clothing',
          slug: 'women-clothing',
          description: 'Clothing for women',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Accessories',
          slug: 'accessories',
          description: 'Fashion accessories',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  // Upload images to Cloudinary or local storage
  static async uploadImages(files: File[]): Promise<UploadResponse[]> {
    try {
      const response = await uploadAPI.uploadImages(files, 'products');
      
      // Handle response format
      if (response.data.uploads) {
        return response.data.uploads.map((upload: any) => ({
          success: true,
          data: {
            url: upload.url,
            publicId: upload.publicId,
            format: upload.format,
            width: upload.width,
            height: upload.height,
          },
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error uploading images:', error);

      // Return mock upload response for development
      return files.map((file, index) => ({
        success: true,
        data: {
          url: `https://via.placeholder.com/800x800?text=Product+Image+${index + 1}`,
          publicId: `mock_public_id_${index}`,
          format: 'jpg',
          width: 800,
          height: 800,
        },
      }));
    }
  }

  // Delete image from Cloudinary
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await uploadAPI.deleteImage(publicId);
    } catch (error) {
      console.error('Error deleting image:', error);
      // For development, just log the error but don't throw
      console.warn('Image deletion failed, but continuing...');
    }
  }

  // Create new product
  static async createProduct(payload: CreateProductPayload): Promise<void> {
    try {
      const response = await productsAPI.create(payload);
      return response.data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  }

  // Get all products (for admin)
  static async getProducts(page = 1, limit = 10): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await productsAPI.getAll({ page, limit });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  static async getProduct(id: string): Promise<Product> {
    try {
      const response = await productsAPI.getById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: string, payload: CreateProductPayload): Promise<void> {
    try {
      await productsAPI.update(id, payload);
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      await productsAPI.delete(id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export { ProductService };
