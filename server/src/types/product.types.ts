export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  compareAtPrice?: number;
  costPrice?: number;
  categoryId: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductVariantFormData {
  size: string;
  color: string;
  colorCode?: string;
  material?: string;
  additionalPrice: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
}

export interface ProductMediaFormData {
  file: File;
  variantId?: string;
  altText?: string;
  isPrimary: boolean;
  mediaType: 'image' | 'video';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    publicId: string;
    width: number;
    height: number;
  };
  message?: string;
}