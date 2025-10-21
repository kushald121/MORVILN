import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Initialize Supabase client for OAuth
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    provider?: string;
  };
  message?: string;
}

// Configure axios instance
const authAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
authAPI.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth Service
export const authService = {
  // Regular login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authAPI.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Regular signup
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await authAPI.post('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  // Google OAuth using Supabase
  async loginWithGoogle(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Google login failed');
    }
  },

  // Facebook OAuth using Supabase
  async loginWithFacebook(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Facebook login failed');
    }
  },

  // Handle OAuth callback
  async handleOAuthCallback(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!session) throw new Error('No session found');

      // Send session to backend to create/sync user
      const response = await authAPI.post('/auth/oauth/callback', {
        email: session.user.email,
        name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'User',
        provider: session.user.app_metadata.provider,
        providerId: session.user.id,
        avatar: session.user.user_metadata.avatar_url,
      });

      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'OAuth callback failed');
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await authAPI.post('/auth/logout');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
    }
  },

  // Get current user
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('userToken');
  },

  // Get token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userToken');
  },
};
