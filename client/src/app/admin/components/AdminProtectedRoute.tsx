'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('adminToken');

      if (token) {
        try {
          // Check if token is valid (not expired)
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;

          if (tokenData.exp && tokenData.exp > currentTime) {
            setIsAuthenticated(true);
          } else {
            // Token expired, remove it
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
            
            // Store the attempted URL for redirect after login
            localStorage.setItem('adminRedirectPath', pathname);
            router.push('/admin/login');
          }
        } catch (error) {
          // Invalid token format, remove it
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          localStorage.setItem('adminRedirectPath', pathname);
          router.push('/admin/login');
        }
      } else {
        setIsAuthenticated(false);
        // Store the attempted URL for redirect after login
        if (pathname !== '/admin/login') {
          localStorage.setItem('adminRedirectPath', pathname);
          router.push('/admin/login');
        }
      }

      setIsLoading(false);
    };

    checkAuthentication();
  }, [pathname, router]);

  return { isAuthenticated, isLoading };
}

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen in the hook
  }

  return <>{children}</>;
}
