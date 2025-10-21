'use client';

import { authService } from '@/lib/auth';

/**
 * Custom hook to get current user and auth state
 * 
 * Usage:
 * const { user, isAuthenticated, logout } = useAuth();
 */
export function useAuth() {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const token = authService.getToken();

  const logout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  return {
    user,
    isAuthenticated,
    token,
    logout,
  };
}
