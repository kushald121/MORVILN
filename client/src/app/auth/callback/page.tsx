'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { authService } from '@/lib/auth';
import { apiClient } from '@/lib/api';

const AuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if this is an email verification callback
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (token_hash && type === 'email') {
          // Handle email verification
          setMessage('Verifying your email...');
          
          const response = await apiClient.get(`/auth/verify-email?token_hash=${token_hash}&type=${type}`);

          if (response.data.success) {
            setStatus('success');
            setMessage('Email verified successfully! You can now login.');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
              router.push('/login?verified=true');
            }, 3000);
          } else {
            setStatus('error');
            setMessage(response.data.message || 'Email verification failed');
          }
        } else {
          // Handle OAuth callback
          setMessage('Completing authentication...');
          const result = await authService.handleOAuthCallback();
          
          if (result.success && result.token) {
            // Store authentication data
            localStorage.setItem('userToken', result.token);
            if (result.user) {
              localStorage.setItem('userData', JSON.stringify(result.user));
            }
            
            // Dispatch custom event to notify AuthContext
            window.dispatchEvent(new Event('auth-state-changed'));
            
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            // Redirect to home page
            setTimeout(() => router.push('/'), 1500);
          } else {
            throw new Error('Authentication failed - no token received');
          }
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || err.message || 'Authentication failed');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Authenticating
              </h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Success!
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Authentication Failed
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full text-orange-600 hover:text-orange-700 py-2 text-sm font-medium"
                >
                  Back to Sign Up
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Wrap with Suspense for useSearchParams
export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
