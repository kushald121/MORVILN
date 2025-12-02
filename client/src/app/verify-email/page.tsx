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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-gray-800">
          {/* Animated Mail Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative mx-auto mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-12 h-12 text-white" />
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
              className="absolute inset-0 w-24 h-24 bg-purple-400 rounded-full opacity-20 mx-auto"
            />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Check Your Email
          </h1>

          <div className="mb-6">
            <p className="text-gray-400 mb-2">
              We've sent a verification link to:
            </p>
            <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 break-all">
              {email || 'your email address'}
            </p>
          </div>

          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3 text-left">
              <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-purple-200">
                <p className="font-semibold mb-1">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-purple-300">
                  <li>Open your email inbox</li>
                  <li>Click the verification link</li>
                  <li>You'll be redirected to login</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-300">
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
              className="w-full bg-white text-black py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-100 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              className="flex items-center justify-center text-gray-400 hover:text-white transition-colors group py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Wrong email address?{' '}
          <Link href="/signup" className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 font-semibold">
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
