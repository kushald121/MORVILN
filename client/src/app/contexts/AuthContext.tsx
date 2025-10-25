'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  getCurrentSessionId: () => string | null;
  getSessionType: () => 'user' | 'guest';
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Initialize auth state
    const currentUser = authService.getCurrentUser();
    const currentToken = authService.getToken();
    setUser(currentUser);
    setToken(currentToken);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Note: Adjust this based on your actual authService.login implementation
      // For now, we'll handle auth through the existing system
      const currentUser = authService.getCurrentUser();
      const currentToken = authService.getToken();
      setUser(currentUser);
      setToken(currentToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  const getCurrentSessionId = () => {
    if (user?.id) {
      return user.id;
    }
    // For guest users, get or create session ID
    let sessionId = localStorage.getItem('guestSessionId');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guestSessionId', sessionId);
    }
    return sessionId;
  };

  const getSessionType = (): 'user' | 'guest' => {
    return user ? 'user' : 'guest';
  };

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        token,
        logout,
        login,
        getCurrentSessionId,
        getSessionType,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
