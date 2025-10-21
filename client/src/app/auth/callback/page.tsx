'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle OAuth callback using Supabase session
        await authService.handleOAuthCallback();
        
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Redirect to home page
        setTimeout(() => router.push('/'), 1500);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Authentication failed');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center px-4">
        <div className="mb-8">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="text-green-600 text-6xl mx-auto">✓</div>
          )}
          {status === 'error' && (
            <div className="text-red-600 text-6xl mx-auto">✕</div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
