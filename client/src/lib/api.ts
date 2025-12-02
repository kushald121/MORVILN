import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { logError, isNetworkError } from './errorHandler';

// API Base URL - can be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Track if we're currently redirecting to avoid multiple redirects
let isRedirecting = false;

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const url = config.url || '';
      
      // For admin routes, use adminToken; for regular routes, use userToken
      if (url.includes('/admin')) {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
          config.headers.Authorization = `Bearer ${adminToken}`;
        }
      } else {
        const token = localStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    logError(error, 'Request Error');
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Log the error
    logError(error, 'API Error');

    // Handle network errors
    if (isNetworkError(error)) {
      console.error('Network error detected. Server may be unreachable.');
      
      // You can show a toast notification here
      if (typeof window !== 'undefined') {
        // Store error in session for recovery
        sessionStorage.setItem('lastNetworkError', JSON.stringify({
          url: error.config?.url,
          timestamp: Date.now(),
        }));
      }
      
      return Promise.reject(error);
    }

    // Handle authentication errors (401)
    // Only redirect for critical auth endpoints, not for all 401s
    if (error.response?.status === 401 && !isRedirecting) {
      const url = error.config?.url || '';
      
      // Only redirect to login for critical auth failures (login, me, profile)
      // Don't redirect for secondary endpoints like orders, favorites, addresses
      const criticalAuthEndpoints = ['/auth/me', '/auth/login', '/auth/profile'];
      const isCriticalAuthFailure = criticalAuthEndpoints.some(endpoint => url.includes(endpoint));
      
      if (isCriticalAuthFailure) {
        isRedirecting = true;
        
        if (typeof window !== 'undefined') {
          // Clear auth data
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          
          // Save current location for redirect after login
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/signup') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
          }
          
          // Redirect to login
          window.location.href = '/login';
        }
        
        // Reset flag after delay
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }

    // Handle forbidden errors (403)
    if (error.response?.status === 403) {
      console.error('Access forbidden. You do not have permission.');
    }

    // Handle server errors (5xx)
    if (error.response && error.response.status >= 500) {
      console.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),
  
  register: (data: { name: string; email: string; password: string; phone?: string }) => 
    apiClient.post('/auth/register', data),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  oauthCallback: (data: any) => 
    apiClient.post('/auth/oauth/callback', data),
  
  getCurrentUser: () => 
    apiClient.get('/auth/me'),
  
  updateProfile: (data: any) => 
    apiClient.put('/auth/profile', data),
};

// ==================== PRODUCTS API ====================
export const productsAPI = {
  // Get all products with pagination and filters
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) => apiClient.get('/products', { params }),
  
  // Get single product by ID
  getById: (id: string) => 
    apiClient.get(`/products/${id}`),
  
  // Get product by slug
  getBySlug: (slug: string) => 
    apiClient.get(`/products/slug/${slug}`),
  
  // Create new product (admin only)
  create: (data: any) => 
    apiClient.post('/products', data),
  
  // Update product (admin only)
  update: (id: string, data: any) => 
    apiClient.put(`/products/${id}`, data),
  
  // Delete product (admin only)
  delete: (id: string) => 
    apiClient.delete(`/products/${id}`),
  
  // Get categories
  getCategories: () => 
    apiClient.get('/products/categories'),
  
  // Get featured products
  getFeatured: () => 
    apiClient.get('/products/featured'),
  
  // Get related products
  getRelated: (id: string) => 
    apiClient.get(`/products/${id}/related`),
};

// ==================== CART API ====================
export const cartAPI = {
  // Get user's cart
  get: () => 
    apiClient.get('/cart'),
  
  // Add item to cart
  addItem: (data: { productId: string; variantId?: string; quantity: number }) => 
    apiClient.post('/cart/items', data),
  
  // Update cart item quantity
  updateItem: (itemId: string, quantity: number) => 
    apiClient.put(`/cart/items/${itemId}`, { quantity }),
  
  // Remove item from cart
  removeItem: (itemId: string) => 
    apiClient.delete(`/cart/items/${itemId}`),
  
  // Clear entire cart
  clear: () => 
    apiClient.delete('/cart'),
  
  // Sync cart with server
  sync: (items: any[]) => 
    apiClient.post('/cart/sync', { items }),
};

// ==================== ORDERS API ====================
export const ordersAPI = {
  // Get all orders for user
  getAll: (params?: { page?: number; limit?: number; status?: string }) => 
    apiClient.get('/orders', { params }),
  
  // Get single order by ID
  getById: (id: string) => 
    apiClient.get(`/orders/${id}`),
  
  // Create new order
  create: (data: {
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  }) => apiClient.post('/orders', data),
  
  // Cancel order
  cancel: (id: string, reason?: string) => 
    apiClient.put(`/orders/${id}/cancel`, { reason }),
  
  // Get order tracking
  getTracking: (id: string) => 
    apiClient.get(`/orders/${id}/tracking`),
};

// ==================== PAYMENT API ====================
export const paymentAPI = {
  // Create Razorpay order
  createOrder: (amount: number, currency: string = 'INR') => 
    apiClient.post('/payment/create-order', { amount, currency }),
  
  // Verify Razorpay payment
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => apiClient.post('/payment/verify', data),
  
  // Process payment and create order
  processPayment: (data: any) => 
    apiClient.post('/payment/process', data),
};

// ==================== FAVORITES API ====================
export const favoritesAPI = {
  // Get user's favorites
  getAll: () => 
    apiClient.get('/favorites'),
  
  // Add product to favorites
  add: (productId: string) => 
    apiClient.post('/favorites', { productId }),
  
  // Remove product from favorites
  remove: (productId: string) => 
    apiClient.delete(`/favorites/${productId}`),
  
  // Check if product is in favorites
  check: (productId: string) => 
    apiClient.get(`/favorites/${productId}/check`),
  
  // Clear all favorites
  clear: () => 
    apiClient.delete('/favorites'),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Dashboard stats
  getStats: () => 
    apiClient.get('/admin/stats'),
  
  // Products Management
  addProduct: (formData: FormData) => 
    apiClient.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  updateProducts: (productIds: string[], updates: any) => 
    apiClient.put('/admin/products/bulk', { productIds, updates }),
  
  deleteProducts: (productIds: string[]) => 
    apiClient.delete('/admin/products/bulk', { data: { productIds } }),
  
  // Users Management
  getUsers: (params?: { page?: number; limit?: number }) => 
    apiClient.get('/admin/users', { params }),
  
  getUser: (id: string) => 
    apiClient.get(`/admin/users/${id}`),
  
  updateUser: (id: string, data: any) => 
    apiClient.put(`/admin/users/${id}`, data),
  
  deleteUser: (id: string) => 
    apiClient.delete(`/admin/users/${id}`),
  
  // Orders Management
  getOrders: (params?: { page?: number; limit?: number; status?: string; search?: string }) => 
    apiClient.get('/admin/orders', { params }),
  
  updateOrderStatus: (id: string, status: string, notes?: string) => 
    apiClient.put(`/admin/orders/${id}/status`, { status, notes }),
  
  // Admin Auth - Single login endpoint that auto-recognizes role from database
  login: (email: string, password: string) => 
    apiClient.post('/admin/login', { email, password }),
};

// ==================== UPLOAD API ====================
export const uploadAPI = {
  // Upload single image
  uploadImage: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) formData.append('folder', folder);
    
    return apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Upload multiple images
  uploadImages: (files: File[], folder?: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    if (folder) formData.append('folder', folder);
    
    return apiClient.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Delete image
  deleteImage: (publicId: string) => 
    apiClient.delete('/upload/image', { data: { publicId } }),
};

// ==================== NOTIFICATIONS API ====================
export const notificationsAPI = {
  // Register FCM token
  registerToken: (token: string) => 
    apiClient.post('/notifications/register', { token }),
  
  // Subscribe to push notifications
  subscribe: (subscription: any) => 
    apiClient.post('/notifications/subscribe', subscription),
  
  // Unsubscribe from push notifications
  unsubscribe: (endpoint: string) => 
    apiClient.post('/notifications/unsubscribe', { endpoint }),
  
  // Get user notifications
  getAll: (params?: { page?: number; limit?: number }) => 
    apiClient.get('/notifications', { params }),
  
  // Mark notification as read
  markAsRead: (id: string) => 
    apiClient.put(`/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: () => 
    apiClient.put('/notifications/read-all'),
};

// Export the axios instance for custom requests
export { apiClient };

// Export default object with all APIs
export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  payment: paymentAPI,
  admin: adminAPI,
  upload: uploadAPI,
  notifications: notificationsAPI,
  favorites: favoritesAPI,
};
