'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useToast } from '../contexts/ToastContext';

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.warning('Email address not found');
      return;
    }

    setResending(true);
    try {
      const response = await apiClient.post('/auth/resend-verification', { email });
      
      if (response.data.success) {
        toast.success('Verification email sent successfully!');
      }
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Animated Mail Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative mx-auto mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-12 h-12 text-orange-600" />
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-24 h-24 bg-orange-400 rounded-full opacity-20 mx-auto"
            />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check Your Email
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              We've sent a verification link to:
            </p>
            <p className="text-lg font-semibold text-orange-600 break-all">
              {email || 'your email address'}
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3 text-left">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Open your email inbox</li>
                  <li>Click the verification link</li>
                  <li>You'll be redirected to login</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>⏱️ Important:</strong> The verification link will expire in <strong>1 hour</strong>. 
              If you don't see the email, check your spam folder.
            </p>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </motion.button>

            <Link
              href="/login"
              className="flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors group py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Wrong email address?{' '}
          <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
            Sign up again
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

// Wrap with Suspense for useSearchParams
const VerifyEmailPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
