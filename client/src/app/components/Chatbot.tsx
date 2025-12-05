"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Instagram, MessageSquare, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulse, setPulse] = useState(true);
  const chatbotRef = useRef<HTMLDivElement>(null);

  // Auto pulse effect when not opened
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setPulse(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com/yourbrand', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/1234567890', '_blank');
  };

  return (
    <>
      {/* Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50" ref={chatbotRef}>
        {/* Floating particles animation when open */}
        {isOpen && (
          <div className="absolute -top-10 -left-10 w-32 h-32 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-500 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Main Chatbot Button */}
        <button
          onClick={handleOpen}
          className={`
            relative group
            w-14 h-14 md:w-16 md:h-16
            rounded-full
            flex items-center justify-center
            shadow-2xl
            transition-all duration-500
            ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
            ${pulse && !isOpen ? 'animate-pulse' : ''}
            bg-gradient-to-br from-black via-gray-900 to-black
            border border-gray-700
            hover:border-purple-500
            hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
            transform hover:scale-110
            overflow-hidden
          `}
        >
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 animate-spin-slow" />
          
          {/* Inner glow */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-900 to-black" />
          
          {/* Icon with gradient */}
          <MessageCircle className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-purple-300 transition-colors" />
          
          {/* Sparkle effect on hover */}
          <Sparkles className="absolute top-1 right-1 w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need help? Chat with us
          </div>
        </button>

        {/* Chatbot Modal */}
        <div
          className={`
            absolute bottom-16 right-0
            w-80 md:w-96
            rounded-2xl
            overflow-hidden
            shadow-2xl
            transform transition-all duration-300
            ${isOpen 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
            }
            ${isAnimating ? 'animate-bounce-subtle' : ''}
            bg-gradient-to-b from-gray-900 to-black
            border border-gray-800
          `}
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-black to-gray-900 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">GENIROSE</h3>
                  <p className="text-gray-400 text-sm">Style Support Team</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Animated typing indicator */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-gray-300 text-sm">Online • Ready to help</span>
            </div>
          </div>

          {/* Chat Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-300 text-center font-serif italic mb-8">
                "How can we elevate your style today?"
              </p>
            </div>

            {/* Chat Options */}
            <div className="space-y-4">
              {/* Instagram Option */}
              <button
                onClick={handleInstagramClick}
                className="group w-full p-4 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300 flex items-center gap-4 hover:scale-[1.02]"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center group-hover:animate-pulse">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-pink-600">IG</span>
                  </div>
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-white font-bold text-lg">Style Stories</h4>
                  <p className="text-gray-400 text-sm">Follow our latest looks & DM for styling tips</p>
                </div>
                <div className="text-pink-400 group-hover:translate-x-2 transition-transform">
                  →
                </div>
              </button>

              {/* WhatsApp Option */}
              <button
                onClick={handleWhatsAppClick}
                className="group w-full p-4 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 flex items-center gap-4 hover:scale-[1.02]"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 via-green-400 to-emerald-600 flex items-center justify-center group-hover:animate-pulse">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600">WA</span>
                  </div>
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-white font-bold text-lg">Instant Style Help</h4>
                  <p className="text-gray-400 text-sm">Chat directly with our stylists</p>
                </div>
                <div className="text-green-400 group-hover:translate-x-2 transition-transform">
                  →
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-xs text-center">
                Response time: <span className="text-green-400 font-bold">within 5 mins</span>
              </p>
              <p className="text-gray-500 text-xs text-center mt-1">
                Mon-Sun • 9AM-10PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;