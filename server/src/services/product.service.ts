import supabase from '../config/database';
import { Product, ProductWithDetails, ProductFilters, Category, ProductVariant, ProductMedia } from '../types/product.types';

export class ProductService {
  // Fetch all products with filters and pagination
  static async getProducts(filters: ProductFilters = {}) {
    try {
      const {
        category_id,
        gender,
        min_price,
        max_price,
        tags,
        is_featured,
        search,
        page = 1,
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = filters;

      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          variants:product_variants(
            id, sku, size, color, color_code, additional_price, 
            stock_quantity, is_active
          ),
          media:product_media(
            id, media_url, alt_text, media_type, is_primary, sort_order
          )
        `)
        .eq('is_active', true);

      // Apply filters
      if (category_id) {
        query = query.eq('category_id', category_id);
      }

      if (gender) {
        query = query.eq('gender', gender);
      }

      if (min_price !== undefined) {
        query = query.gte('base_price', min_price);
      }

      if (max_price !== undefined) {
        query = query.lte('base_price', max_price);
      }

      if (is_featured !== undefined) {
        query = query.eq('is_featured', is_featured);
      }

      if (tags && tags.length > 0) {
        query = query.overlaps('tags', tags);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%, short_description.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sort_by, { ascending: sort_order === 'asc' });

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      // Process media to sort by sort_order and mark primary
      const processedProducts = data?.map(product => ({
        ...product,
        media: product.media
          ?.sort((a: ProductMedia, b: ProductMedia) => a.sort_order - b.sort_order)
          ?.map((media: ProductMedia) => ({
            ...media,
            is_primary: media.is_primary || false
          })) || []
      }));

      return {
        products: processedProducts as ProductWithDetails[],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  }

  // Fetch single product by ID or slug
  static async getProductById(identifier: string): Promise<ProductWithDetails | null> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug, description),
          variants:product_variants(
            id, sku, size, color, color_code, material, additional_price, 
            stock_quantity, reserved_quantity, is_active
          ),
          media:product_media(
            id, media_url, cloudinary_public_id, alt_text, media_type, 
            is_primary, sort_order
          )
        `)
        .eq('is_active', true);

      // Check if identifier is UUID or slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
      
      if (isUUID) {
        query = query.eq('id', identifier);
      } else {
        query = query.eq('slug', identifier);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Product not found
        }
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      // Process and sort media
      const processedProduct = {
        ...data,
        variants: data.variants?.filter((v: ProductVariant) => v.is_active) || [],
        media: data.media
          ?.sort((a: ProductMedia, b: ProductMedia) => a.sort_order - b.sort_order) || []
      };

      return processedProduct as ProductWithDetails;
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  }

  // Fetch featured products
  static async getFeaturedProducts(limit: number = 8): Promise<ProductWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          variants:product_variants(
            id, sku, size, color, additional_price, stock_quantity, is_active
          ),
          media:product_media(
            id, media_url, alt_text, is_primary, sort_order
          )
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch featured products: ${error.message}`);
      }

      return data?.map(product => ({
        ...product,
        media: product.media
          ?.sort((a: ProductMedia, b: ProductMedia) => a.sort_order - b.sort_order) || []
      })) as ProductWithDetails[] || [];
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error);
      throw error;
    }
  }

  // Fetch categories
  static async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data as Category[] || [];
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(searchTerm: string, limit: number = 10): Promise<ProductWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          variants:product_variants(id, size, color, additional_price, stock_quantity),
          media:product_media(media_url, alt_text, is_primary, sort_order)
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%, short_description.ilike.%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to search products: ${error.message}`);
      }

      return data?.map(product => ({
        ...product,
        media: product.media
          ?.sort((a: ProductMedia, b: ProductMedia) => a.sort_order - b.sort_order) || []
      })) as ProductWithDetails[] || [];
    } catch (error) {
      console.error('Error in searchProducts:', error);
      throw error;
    }
  }

  // Check product availability
  static async checkProductAvailability(variantId: string, quantity: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('stock_quantity, reserved_quantity')
        .eq('id', variantId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return false;
      }

      const availableStock = data.stock_quantity - data.reserved_quantity;
      return availableStock >= quantity;
    } catch (error) {
      console.error('Error in checkProductAvailability:', error);
      return false;
    }
  }
}