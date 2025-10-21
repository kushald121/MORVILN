'use client';

import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

interface AuthButtonsProps {
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  isLoading?: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ 
  onGoogleLogin, 
  onFacebookLogin, 
  isLoading = false 
}) => {
  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 border border-gray-200"
      >
        <FcGoogle className="w-5 h-5" />
        <span>Continue with Google</span>
      </button>

      {/* Facebook Login Button */}
      <button
        type="button"
        onClick={onFacebookLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#166FE5] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <FaFacebook className="w-5 h-5" />
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
};

export default AuthButtons;
