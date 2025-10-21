'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import SplashCursor from '@/app/components/ui/splash-cursor';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate admin login validation
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      // Store admin session data
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userPFP', 'admin');

      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    } else {
      alert('Invalid admin credentials');
      setCredentials(prev => ({ ...prev, password: '' }));
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      {/* <SplashCursor /> */}
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        {/* Admin PFP Display */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              A
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-black">★</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Admin Login
        </h1>
        <p className="text-white/80 text-center mb-8">
          Access administrative controls
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-white font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter admin username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Signing In...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/subjective.login')}
            className="text-white/80 hover:text-white text-sm underline"
          >
            ← Back to Profile Selection
          </button>
        </div>
      </div>
    </div>
  );
}
