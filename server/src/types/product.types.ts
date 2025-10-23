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

export interface ProductWithDetails extends Product {
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