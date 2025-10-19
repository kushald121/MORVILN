export interface CartItem {
  variantId: string;
  quantity: number;
  addedAt: string;
}

export interface GuestCart {
  [variantId: string]: number;
}

export interface SessionData {
  userId?: string;
  email?: string;
  createdAt?: string;
  lastActivity?: string;
  [key: string]: any;
}

export interface RedisOperationResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface DatabasePool {
  query: (query: string, params?: any[]) => Promise<{ rows: any[] }>;
}
