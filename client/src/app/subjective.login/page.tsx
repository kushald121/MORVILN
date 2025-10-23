'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubjectiveLogin() {
  const [selectedPFP, setSelectedPFP] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginChoice = async (loginType: 'admin' | 'manager') => {
    if (selectedPFP && !isLoading) {
      setIsLoading(true);

      // Add a small delay for better UX
      setTimeout(() => {
        if (loginType === 'admin') {
          router.push('/subjective.login/admin.login');
        } else {
          router.push('/subjective.login/manager.login');
        }
      }, 800);
    } else if (!selectedPFP) {
      // Enhanced feedback for no selection
      const feedback = document.createElement('div');
      feedback.textContent = 'Please select a profile picture first';
      feedback.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up z-50';
      document.body.appendChild(feedback);
      setTimeout(() => feedback.remove(), 3000);
    }
  };

  const handlePFPSelection = (pfpType: 'admin' | 'manager') => {
    setSelectedPFP(pfpType);

    // Add selection feedback animation
    const selectedElement = document.getElementById(`pfp-${pfpType}`);
    if (selectedElement) {
      selectedElement.classList.add('animate-bounce-subtle');
      setTimeout(() => {
        selectedElement.classList.remove('animate-bounce-subtle');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4 animate-slide-in-left">
              Choose Your Profile
            </h1>
            <p className="text-muted-foreground text-lg animate-slide-in-right">
              Select your role to continue to the dashboard
            </p>
          </div>

          {/* Profile Selection Card */}
          <div className="bg-card backdrop-blur-xl rounded-3xl p-8 shadow-2xl animate-fade-in-up border border-border">
            {/* PFP Selection */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
                Select Profile Picture
              </h2>

              <div className="flex justify-center items-center space-x-8">
                {/* Admin PFP */}
                <div
                  id="pfp-admin"
                  className={`relative cursor-pointer transition-all duration-300 group ${
                    selectedPFP === 'admin'
                      ? 'scale-110 shadow-2xl shadow-yellow-400/25'
                      : 'hover:scale-105 hover:shadow-xl'
                  }`}
                  onClick={() => handlePFPSelection('admin')}
                >
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl transition-all duration-300 group-hover:shadow-yellow-400/25">
                      👑
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-sm font-bold text-white">★</span>
                    </div>

                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                      selectedPFP === 'admin' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`}>
                      <div className="w-full h-full bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-foreground font-semibold text-lg">Administrator</h3>
                    <p className="text-muted-foreground text-sm">Full system access</p>
                  </div>
                </div>

                {/* Manager PFP */}
                <div
                  id="pfp-manager"
                  className={`relative cursor-pointer transition-all duration-300 group ${
                    selectedPFP === 'manager'
                      ? 'scale-110 shadow-2xl shadow-blue-400/25'
                      : 'hover:scale-105 hover:shadow-xl'
                  }`}
                  onClick={() => handlePFPSelection('manager')}
                >
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl transition-all duration-300 group-hover:shadow-blue-400/25">
                      ⚡
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-sm font-bold text-white">🚀</span>
                    </div>

                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                      selectedPFP === 'manager' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`}>
                      <div className="w-full h-full bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-foreground font-semibold text-lg">Manager</h3>
                    <p className="text-muted-foreground text-sm">Team management</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Options */}
            <div className="space-y-6">
              <button
                onClick={() => handleLoginChoice('admin')}
                disabled={!selectedPFP || isLoading}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                  selectedPFP === 'admin' && !isLoading
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-2xl hover:shadow-yellow-400/25 transform hover:-translate-y-2 animate-glow'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isLoading && selectedPFP === 'admin' ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-3"></div>
                    <span>Accessing Admin Panel...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Admin Login</span>
                    {selectedPFP === 'admin' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    )}
                  </>
                )}
              </button>

              <button
                onClick={() => handleLoginChoice('manager')}
                disabled={!selectedPFP || isLoading}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                  selectedPFP === 'manager' && !isLoading
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-2xl hover:shadow-blue-400/25 transform hover:-translate-y-2 animate-glow'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isLoading && selectedPFP === 'manager' ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-3"></div>
                    <span>Accessing Manager Panel...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Manager Login</span>
                    {selectedPFP === 'manager' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    )}
                  </>
                )}
              </button>
            </div>

            {/* Selection Status */}
            {selectedPFP && !isLoading && (
              <div className="mt-8 text-center animate-fade-in-up">
                <div className="inline-flex items-center space-x-2 bg-secondary rounded-full px-6 py-3 backdrop-blur-sm border border-border">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-foreground text-sm font-medium">
                    Selected: {selectedPFP === 'admin' ? '👑 Administrator' : '⚡ Manager'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 animate-fade-in-up">
            <p className="text-muted-foreground text-sm">
              Choose your role to access the appropriate dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}