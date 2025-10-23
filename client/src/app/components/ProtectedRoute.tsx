'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * HOC to protect routes that require authentication
 * Usage: Wrap your page component with this
 * 
 * Example:
 * export default function ProfilePage() {
 *   return (
 *     <ProtectedRoute>
 *       <div>Protected Content</div>
 *     </ProtectedRoute>
 *   );
 * }
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  // Show loading or nothing while checking auth
  if (!authService.isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
