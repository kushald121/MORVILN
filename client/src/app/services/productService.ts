import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ProductMedia {
  id: string;
  product_id: string;
  variant_id?: string;
  media_url: string;
  cloudinary_public_id?: string;
  media_type: 'image' | 'video';
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color?: string;
  color_code?: string;
  material?: string;
  additional_price: number;
  stock_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  base_price: number;
  compare_at_price?: number;
  cost_price?: number;
  category_id?: string;
  locked_section_id?: string;
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  tags?: string[];
  is_featured: boolean;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants: ProductVariant[];
  media: ProductMedia[];
}

export interface ProductFilters {
  category_id?: string;
  gender?: string;
  min_price?: number;
  max_price?: number;
  tags?: string[];
  is_featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export class ProductService {
  // Get single product by ID or slug
  static async getProduct(identifier: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/product/${identifier}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch product');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching product:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  // Get products with filters
  static async getProducts(filters: ProductFilters = {}): Promise<{
    products: Product[];
    pagination: any;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await axios.get(`${API_URL}/product?${queryParams.toString()}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
      
      return {
        products: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/product/featured?limit=${limit}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch featured products');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }

  // Search products
  static async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/product/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to search products');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error searching products:', error);
      throw new Error(error.response?.data?.message || 'Failed to search products');
    }
  }

  // Get categories
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${API_URL}/product/categories`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch categories');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Check product availability
  static async checkAvailability(variantId: string, quantity: number = 1): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/product/availability/${variantId}?quantity=${quantity}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to check availability');
      }
      
      return response.data.data.is_available;
    } catch (error: any) {
      console.error('Error checking availability:', error);
      throw new Error(error.response?.data?.message || 'Failed to check availability');
    }
  }
}