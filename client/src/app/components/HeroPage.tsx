import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const DISPLAY_DURATION = 2000; // 2 seconds display
  const TRANSITION_DURATION = 1000; // 1 second transition

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/hero-images`);
      const data = await response.json();
      setHeroImages(data.images || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (heroImages.length === 0) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (DISPLAY_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [currentIndex, heroImages.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setProgress(0);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, heroImages.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-2xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (heroImages.length === 0) {
    return (
      <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">BLACK FRIDAY</h1>
          <h2 className="text-4xl mb-8">SALE!!!</h2>
          <p className="text-xl mb-8">UPTO 60% OFF</p>
          <button className="px-8 py-3 bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
            SHOP NOW
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Hero Images */}
      {heroImages.map((image, index) => (
        <div
          key={image._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex && !isTransitioning
              ? 'opacity-100'
              : index === currentIndex && isTransitioning
              ? 'opacity-0'
              : 'opacity-0'
          }`}
        >
          <img
            src={image.imageUrl}
            alt={image.title || `Hero ${index + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                {image.title || 'BLACK FRIDAY'}
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {image.subtitle || 'SALE!!!'}
              </h2>
              {image.description && (
                <p className="text-xl md:text-2xl mb-8">{image.description}</p>
              )}
              <button className="px-8 py-3 bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors border-2 border-white hover:scale-105 transform duration-200">
                {image.ctaText || 'SHOP NOW'}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Progress Loader - Bottom Right */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 right-8 z-50">
          <div className="relative w-12 h-12">
            {/* Background Circle */}
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="3"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                className="transition-all duration-50 ease-linear"
              />
            </svg>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {currentIndex + 1}/{heroImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Dots - Bottom Center */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-40">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setProgress(0);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;