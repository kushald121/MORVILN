'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  // stagger motion animation
  const containerMotion = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    },
  };

  // animation parameters for elements
  const textMotion = {
    hidden: {
      opacity: 0,
      y: -50
    },
    visible: {
      opacity: 1,
      y: 0
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerMotion}
    >
      {/* LOGO + Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <motion.div variants={textMotion} className="text-center">
          <Link href="/">
            <div className="mx-auto h-12 w-auto flex items-center justify-center">
              <h1 className="text-3xl font-bold text-indigo-600">MORVILN</h1>
            </div>
          </Link>
        </motion.div>
        <motion.h2
          className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          variants={textMotion}
        >
          Sign in to your account
        </motion.h2>
      </div>

      {/* Input Section */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Address */}
          <motion.div variants={textMotion}>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email Address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={textMotion}>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your password"
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={textMotion}>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-md hover:shadow-lg hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
            >
              Sign In
            </button>
          </motion.div>
        </form>

        {/* SIGN UP Link */}
        <motion.p className="mt-10 text-center text-sm text-gray-500" variants={textMotion}>
          Not a member?{' '}
          <Link href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-l from-blue-500 to-purple-500 transition-all duration-200">
            Join today for free.
          </Link>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Login;
