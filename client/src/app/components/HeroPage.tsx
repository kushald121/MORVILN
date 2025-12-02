import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeroImage {
  _id: string;
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  image_url?: string;
  ctaText?: string;
  cta_text?: string;
  ctaLink?: string;
  cta_link?: string;
  isActive: boolean;
  sortOrder: number;
}

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const DISPLAY_DURATION = 5000; // 5 seconds display

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/hero`);
      const data = await response.json();
      if (data.success && data.images && data.images.length > 0) {
        setHeroImages(data.images);
      } else {
        setHeroImages([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      setIsLoading(false);
    }
  };

  // Auto-advance slides
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, DISPLAY_DURATION);

    return () => clearInterval(timer);
  }, [heroImages.length]);

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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Hero Images */}
      {heroImages.map((image, index) => {
        // Handle both camelCase and snake_case field names
        const imgUrl = image.imageUrl || image.image_url || '';
        const ctaText = image.ctaText || image.cta_text || 'SHOP NOW';
        const ctaLink = image.ctaLink || image.cta_link || '/allproducts';
        
        return (
          <div
            key={image.id || image._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image using img tag for better loading */}
            <img
              src={imgUrl}
              alt={image.title || `Hero ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', imgUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
              <div className="text-center text-white px-4">
                {image.title && (
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-lg">
                    {image.title}
                  </h1>
                )}
                {(image.subtitle || image.description) && (
                  <h2 className="text-2xl md:text-4xl font-semibold mb-6 drop-shadow-md">
                    {image.subtitle || image.description}
                  </h2>
                )}
                <Link 
                  href={ctaLink}
                  className="inline-block px-8 py-3 bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                >
                  {ctaText}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Counter - Bottom Right */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 right-8 z-50">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white text-sm font-semibold">
              {currentIndex + 1} / {heroImages.length}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Dots - Bottom Center */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75 w-2'
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