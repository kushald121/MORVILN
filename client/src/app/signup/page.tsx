'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiShoppingBag } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { authService } from '@/lib/auth';

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await authService.loginWithFacebook();
    } catch (err: any) {
      setError(err.message || 'Facebook login failed');
    }
  };

  return (
    <>
      {/* <SplashCursor /> */}
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div
          ref={containerRef}
          className="w-full max-w-lg sm:max-w-2xl lg:max-w-6xl bg-slate-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50"
          style={{ minHeight: '400px' }}
        >
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Form */}
            <div ref={formRef} className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">

    

              {step === 1 ? (
                <div>
                  {/* Welcome Message */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {isLogin ? 'WELCOME BACK!' : 'JOIN MORVILN!'}
                    </h2>
                    <p className="text-slate-300">
                      {isLogin
                        ? 'Access your personal account by logging in.'
                        : 'Create your account and start your fashion journey.'
                      }
                    </p>
                  </div>

                  {/* Toggle Login/Signup */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-slate-700/50 rounded-full p-1 flex border border-slate-600/30">
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLogin
                          ? 'bg-slate-900 text-white shadow-md border border-slate-600'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                          }`}
                      >
                        Log In
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${!isLogin
                          ? 'bg-slate-900 text-white shadow-md border border-slate-600'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                          }`}
                      >
                        Sign up
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name field - only for signup */}
                    {!isLogin && (
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full py-4 px-4 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-slate-800/50 text-white placeholder-slate-400"
                          placeholder="Enter your full name"
                        />
                      </div>
                    )}

                    {/* Email field */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Email Address or Username
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full py-4 px-4 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-slate-800/50 text-white placeholder-slate-400"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Phone field - only for signup */}
                    {!isLogin && (
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required={!isLogin}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full py-4 px-4 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-slate-800/50 text-white placeholder-slate-400"
                          placeholder="Enter your phone number"
                        />
                        <p className="text-xs text-slate-400 mt-2">Required for delivery updates</p>
                      </div>
                    )}

                    {/* Password field - for both login and signup */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full py-4 px-4 pr-12 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-slate-800/50 text-white placeholder-slate-400"
                          placeholder="Enter your password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-200 focus:outline-none"
                          >
                            <span className="h-5 w-5">
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                          </button>
                        </div>
                      </div>
                      {isLogin && (
                        <div className="text-right mt-2">
                          <Link
                            href="/Rachna/forgot-password/"
                            className="text-sm text-slate-400 hover:text-white transition duration-300"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password field - only for signup */}
                    {!isLogin && (
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          Confirm Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          required={!isLogin}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full py-4 px-4 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-slate-800/50 text-white placeholder-slate-400"
                          placeholder="Confirm your password"
                        />
                      </div>
                    )}

                    {/* Remember me checkbox for login */}
                    {isLogin && (
                      <div className="flex items-center">
                        <input
                          id="remember"
                          name="remember"
                          type="checkbox"
                          className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-slate-600 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-slate-200">
                          Remember me
                        </label>
                      </div>
                    )}

                    {/* Error message */}
                    {error && (
                      <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm text-center">
                        {error}
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Send OTP')}
                    </button>



                    {/* Terms and conditions */}
                    {!isLogin && (
                      <p className="text-xs text-slate-400 text-center">
                        By continuing, you agree to our{' '}
                        <span className="text-white cursor-pointer hover:underline">Terms of Use</span> and{' '}
                        <span className="text-white cursor-pointer hover:underline">Privacy Policy</span>.
                      </p>
                    )}

                    {/* Switch between login/signup */}
                    <div className="text-center">
                      <p className="text-sm text-slate-300">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                          type="button"
                          onClick={() => setIsLogin(!isLogin)}
                          className="text-white font-semibold hover:underline"
                        >
                          {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                      </p>
                    </div>

                  </form>
                </div>

              ) : (
                /* OTP Verification Step */
                <div>
                  <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-600">
                      <span className="w-10 h-10 text-white">
                        <FiShield />
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Verify Your Account
                    </h3>
                    <p className="text-sm text-slate-300">
                      We have sent a verification code to<br />
                      <span className="font-medium text-white">{formData.email}</span> and <span className="font-medium text-white">{formData.phone}</span>
                    </p>
                  </div>

                  <form onSubmit={handleOtpVerification} className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full py-4 px-4 text-center text-2xl font-bold border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-slate-800/50 text-white placeholder-slate-400"
                        placeholder="Enter OTP"
                        maxLength={6}
                      />
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="text-sm text-slate-400">
                          Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="text-white hover:text-slate-300 font-medium text-sm transition duration-300"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm text-center">
                        {error}
                      </div>
                    )}

                    {/* Verify button */}
                    <button
                      type="submit"
                      disabled={loading || !otp.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {loading ? 'Verifying...' : 'VERIFY & LOGIN'}
                    </button>

                    {/* Back button */}
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp('');
                        setError('');
                        setOtpTimer(0);
                      }}
                      className="w-full text-slate-400 hover:text-white font-medium transition duration-300"
                    >
                      ← Back to form
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Sign In Link */}
            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;

