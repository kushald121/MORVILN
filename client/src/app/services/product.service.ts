import {
  Category,
  // ProductFormData,
  // ProductVariantFormData,
  // ProductMediaFormData,
  CreateProductPayload,
  UploadResponse,
  Product
} from '../types/product.types';

class ProductService {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
      const response = await fetch(`${this.API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      if (Array.isArray(data)) {
        return data;
      } else if (data.categories) {
        return data.categories;
      } else if (data.data) {
        return data.data;
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
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'morviln_products'); // Cloudinary preset

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();

        return {
          success: true,
          data: {
            url: data.secure_url,
            publicId: data.public_id,
            format: data.format,
            width: data.width,
            height: data.height,
          },
        };
      });

      return await Promise.all(uploadPromises);
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
      const response = await fetch(
        `https://api.cloudinary.com/v1_1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_id: publicId,
            api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      // For development, just log the error but don't throw
      console.warn('Image deletion failed, but continuing...');
    }
  }

  // Create new product
  static async createProduct(payload: CreateProductPayload): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
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
      const response = await fetch(
        `${this.API_BASE_URL}/products?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  static async getProduct(id: string): Promise<Product> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: string, payload: CreateProductPayload): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export { ProductService };
