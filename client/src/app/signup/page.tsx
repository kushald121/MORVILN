'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { gsap } from 'gsap';
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
// import SplashCursor from '../components/ui/splash-cursor';

const SignupPage = () => {
  const [isLogin, setIsLogin] = useState(false); // Set to false for signup mode
  const [step, setStep] = useState(1); // 1: form, 2: otp verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // High-quality fashion images array
  const fashionImages = [
    'https://voilastudio.in/old_website_assets/voilastudio_admin/images/model_images/indian_model/ANMOL_23_1_23%20(16).webp',
    'https://img.freepik.com/free-photo/portrait-handsome-fashion-stylish-hipster-model-dressed-warm-overcoat-posing-studio_158538-11452.jpg',
    'https://img.freepik.com/premium-photo/fashion-model-posing-with-hand-pocket-blue-sky-background_661495-125208.jpg?semt=ais_hybrid&w=740&q=80',
    'https://img.freepik.com/free-photo/man-suit-studio_1303-5846.jpg?semt=ais_hybrid&w=740&q=80'
  ];

  // Timer effect for OTP
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % fashionImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [fashionImages.length]);

  // GSAP animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([formRef.current, imageRef.current], { opacity: 0 });


      // Logo animation
      gsap.fromTo(logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }
      );

      // Container entrance
      gsap.fromTo(containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.3 }
      );

      // Form slide in from left
      gsap.fromTo(formRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.6 }
      );

      // Image slide in from right
      gsap.fromTo(imageRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.8 }
      );

      // Floating animation for the container
      gsap.to(containerRef.current, {
        y: -10,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      // Animate form inputs on focus
      const inputs = formRef.current?.querySelectorAll('input');
      inputs?.forEach((input) => {
        input.addEventListener('focus', () => {
          gsap.to(input, {
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out"
          });
        });

        input.addEventListener('blur', () => {
          gsap.to(input, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
          });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Image change animation
  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { scale: 1.1, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [currentImageIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!isLogin && !formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!isLogin && !formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!isLogin && !/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return false;
    }
    if (isLogin && !formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login flow
        const sessionId = localStorage.getItem('guestSessionId');
        const response = await axios.post('https://rachna-backend-1.onrender.com/api/user/login', {
          email: formData.email,
          password: formData.password,
          sessionId
        });

        if (response.data.success) {
          // Store auth data with 15-day expiry
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 15);

          localStorage.setItem('userToken', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data.user));
          localStorage.setItem('authExpiry', expiryDate.toISOString());

          router.push('/');
        }
      } else {
        // Signup flow - validate passwords first
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // Send OTP for signup
        const response = await axios.post('https://rachna-backend-1.onrender.com/api/user/send-otp', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });

        if (response.data.success) {
          setStep(2);
          setOtpTimer(30); // 30 seconds
        } else {
          setError(response.data.message || 'Failed to send OTP');
        }
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);

      // Handle specific case where user doesn't exist during login
      const axiosError = error as { response?: { data?: { action?: string; message?: string } } };
      if (axiosError.response?.data?.action === 'signup') {
        setError(axiosError.response.data.message || 'Please sign up instead');
        // Auto-redirect to signup after 3 seconds
        setTimeout(() => {
          setIsLogin(false);
          setError('');
          setFormData({ name: '', email: formData.email, password: '', confirmPassword: '', phone: '' });
        }, 3000);
      } else {
        setError(axiosError.response?.data?.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }



    setLoading(true);
    setError('');

    try {
      const sessionId = localStorage.getItem('guestSessionId');
      console.log('Verifying OTP:', { email: formData.email, phone: formData.phone, otp: otp.trim() });

      const response = await axios.post('https://rachna-backend-1.onrender.com/api/user/verify-otp', {
        email: formData.email,
        phone: formData.phone,
        otp: otp.trim(), // Ensure no whitespace
        name: formData.name,
        password: formData.password,
        sessionId
      });

      if (response.data.success) {
        // Store auth data with 15-day expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 15);

        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('authExpiry', expiryDate.toISOString());

        router.push('/');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');


    try {
      const response = await axios.post('https://rachna-backend-1.onrender.com/api/user/send-otp', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response.data.success) {
        setOtpTimer(30); // Reset timer to 30 seconds
        setOtp('');
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <SplashCursor /> */}
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div
          ref={containerRef}
          className="w-full max-w-lg sm:max-w-2xl lg:max-w-6xl bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
          style={{ minHeight: '400px' }}
        >
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Form */}
            <div ref={formRef} className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">

    

              {step === 1 ? (
                <div>
                  {/* Welcome Message */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {isLogin ? 'WELCOME BACK!' : 'JOIN MORVILN!'}
                    </h2>
                    <p className="text-gray-600">
                      {isLogin
                        ? 'Access your personal account by logging in.'
                        : 'Create your account and start your fashion journey.'
                      }
                    </p>
                  </div>

                  {/* Toggle Login/Signup */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 rounded-full p-1 flex border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLogin
                          ? 'bg-white text-gray-900 shadow-md border border-gray-300'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                      >
                        Log In
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${!isLogin
                          ? 'bg-white text-gray-900 shadow-md border border-gray-300'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full py-4 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                    )}

                    {/* Email field */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address or Username
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full py-4 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Phone field - only for signup */}
                    {!isLogin && (
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required={!isLogin}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full py-4 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Enter your phone number"
                        />
                        <p className="text-xs text-gray-500 mt-2">Required for delivery updates</p>
                      </div>
                    )}

                    {/* Password field - for both login and signup */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full py-4 px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Enter your password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
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
                            className="text-sm text-gray-500 hover:text-gray-700 transition duration-300"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password field - only for signup */}
                    {!isLogin && (
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          required={!isLogin}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full py-4 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-white text-gray-900 placeholder-gray-500"
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
                          className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                    )}

                    {/* Error message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
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
                      <p className="text-xs text-gray-500 text-center">
                        By continuing, you agree to our{' '}
                        <span className="text-gray-900 cursor-pointer hover:underline">Terms of Use</span> and{' '}
                        <span className="text-gray-900 cursor-pointer hover:underline">Privacy Policy</span>.
                      </p>
                    )}

                    {/* Switch between login/signup */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                          type="button"
                          onClick={() => setIsLogin(!isLogin)}
                          className="text-gray-900 font-semibold hover:underline"
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
                    <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200">
                      <span className="w-10 h-10 text-gray-700">
                        <FiShield />
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Verify Your Account
                    </h3>
                    <p className="text-sm text-gray-600">
                      We have sent a verification code to<br />
                      <span className="font-medium text-gray-900">{formData.email}</span> and <span className="font-medium text-gray-900">{formData.phone}</span>
                    </p>
                  </div>

                  <form onSubmit={handleOtpVerification} className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full py-4 px-4 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Enter OTP"
                        maxLength={6}
                      />
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="text-sm text-gray-500">
                          Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="text-gray-900 hover:text-gray-700 font-medium text-sm transition duration-300"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
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
                      className="w-full text-gray-600 hover:text-gray-900 font-medium transition duration-300"
                    >
                      ← Back to form
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right Side - Fashion Images */}
            <div ref={imageRef} className="hidden lg:block lg:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
              <Image
                src={fashionImages[currentImageIndex]}
                alt={`High-quality fashion showcase featuring elegant clothing and modern style - Image ${currentImageIndex + 1} of ${fashionImages.length}`}
                fill
                className="object-cover transition-all duration-1000 ease-in-out"
                style={{ minHeight: '600px' }}
                priority={currentImageIndex === 0}
                sizes="(max-width: 768px) 0vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Image indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {fashionImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                      }`}
                  />
                ))}
              </div>

              {/* Fashion text overlay */}
              <div className="absolute top-8 right-8 text-white z-20">
                <h3 className="text-2xl font-bold mb-2">MORVILN</h3>
                <p className="text-sm opacity-90">Fashion Forward</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
