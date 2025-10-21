'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import SplashCursor from '@/app/components/ui/splash-cursor';

export default function ManagerLogin() {
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

    // Simulate manager login validation
    if (credentials.username === 'manager' && credentials.password === 'manager123') {
      // Store manager session data
      localStorage.setItem('userRole', 'manager');
      localStorage.setItem('userPFP', 'manager');

      // Redirect to manager dashboard
      router.push('/manager/dashboard');
    } else {
      alert('Invalid manager credentials');
      setCredentials(prev => ({ ...prev, password: '' }));
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      {/* <SplashCursor /> */}
      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700">
        {/* Manager PFP Display */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-slate-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              M
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">⚡</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Manager Login
        </h1>
        <p className="text-slate-300 text-center mb-8">
          Access management controls
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-slate-200 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter manager username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-slate-200 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter manager password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Signing In...' : 'Sign In as Manager'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/subjective.login')}
            className="text-slate-400 hover:text-slate-200 text-sm underline transition-colors"
          >
            ← Back to Profile Selection
          </button>
        </div>
      </div>
    </div>
  );
}
