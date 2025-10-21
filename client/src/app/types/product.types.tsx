export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  compareAtPrice: number;
  costPrice: number;
  categoryId: string;
  gender: 'unisex' | 'men' | 'women' | 'kids';
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface ProductVariantFormData {
  size: string;
  color: string;
  colorCode: string;
  material: string;
  additionalPrice: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
}

export interface ProductMediaFormData {
  mediaUrl: string;
  cloudinaryPublicId: string;
  mediaType: 'image' | 'video';
  altText: string;
  isPrimary: boolean;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
  };
  error?: string;
}

export interface CreateProductPayload {
  product: ProductFormData;
  variants: ProductVariantFormData[];
  media: ProductMediaFormData[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  compareAtPrice?: number;
  costPrice?: number;
  categoryId: string;
  category?: Category;
  gender: 'unisex' | 'men' | 'women' | 'kids';
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  variants: ProductVariant[];
  media: ProductMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  colorCode: string;
  material?: string;
  additionalPrice: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMedia {
  id: string;
  productId: string;
  mediaUrl: string;
  cloudinaryPublicId: string;
  mediaType: 'image' | 'video';
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
