'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate manager login validation
    if (credentials.username === 'manager' && credentials.password === 'manager123') {
      localStorage.setItem('userRole', 'manager');
      localStorage.setItem('userPFP', 'manager');
      router.push('/manager/dashboard');
    } else {
      alert('Invalid manager credentials');
      setCredentials(prev => ({ ...prev, password: '' }));
    }

    setIsLoading(false);
  };

  return (
    // The main container uses the background color from our theme variables.
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* 
        The login card now uses theme variables for background, border, and text.
        Light theme: white background, light gray border, black text.
        Dark theme: dark gray background, darker gray border, white text.
      */}
      <div className="max-w-md w-full bg-card-bg/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-card-border">
        {/* Manager PFP Display - Unchanged as it uses specific brand colors */}
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

        {/* Text now uses the foreground color from our theme variables */}
        <h1 className="text-3xl font-bold text-foreground text-center mb-2">
          Manager Login
        </h1>
        <p className="text-foreground/70 text-center mb-8">
          Access management controls
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-foreground/90 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              // Input fields also use theme variables for a consistent look
              className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
              placeholder="Enter manager username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-foreground/90 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
              placeholder="Enter manager password"
              required
            />
          </div>

          {/* Button styling remains the same as it uses specific brand colors (blue gradient) */}
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
            className="text-foreground/60 hover:text-foreground/80 text-sm underline"
          >
            ← Back to Profile Selection
          </button>
        </div>
      </div>
    </div>
  );
}
