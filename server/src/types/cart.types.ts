export interface CartItem {
  id: string;
  user_id: string;
  variant_id: string;
  quantity: number;
  added_at: string;
  updated_at: string;
}

export interface CartItemWithDetails extends CartItem {
  product: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    compare_at_price?: number;
    is_active: boolean;
  };
  variant: {
    id: string;
    sku: string;
    size: string;
    color?: string;
    color_code?: string;
    additional_price: number;
    stock_quantity: number;
    is_active: boolean;
  };
  media?: {
    media_url: string;
    alt_text?: string;
  };
}

export interface AddToCartRequest {
  variant_id: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface CartSummary {
  items: CartItemWithDetails[];
  total_items: number;
  subtotal: number;
  estimated_total: number;
}