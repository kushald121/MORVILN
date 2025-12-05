import React, { useState } from 'react';
import Image from 'next/image';

// Data structure using the uploaded file names
const categoriesData = [
  { name: 'PANTS', imageSrc: '/images2/pants.webp' },
  { name: 'VESTS', imageSrc: '/images2/vests.webp' },
  { name: 'T-SHIRTS', imageSrc: '/images2/t-shirts.webp' },
  { name: 'JEANS', imageSrc: '/images2/jeans.webp' },
  { name: 'SHORTS', imageSrc: '/images2/shorts.webp' },
];

const CategoryBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categoriesData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categoriesData.length) % categoriesData.length);
  };

  return (
    <section className="bg-black text-white py-12 px-4 md:px-8 mt-16">

      {/* --- Category Grid/Carousel --- */}
      <div className="w-full">
        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {categoriesData.map((category) => (
                <div key={category.name} className="w-full flex-shrink-0">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all z-10"
            aria-label="Previous category"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all z-10"
            aria-label="Next category"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {categoriesData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                  }`}
                aria-label={`Go to category ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-5 w-full gap-0">
          {categoriesData.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>

      {/* --- Main Title --- */}
      <h2 className="text-center text-4xl font-extrabold tracking-widest uppercase mt-8 mb-4">
        NEW ARRIVALS | GENRAGE
      </h2>

    </section>
  );
};

// Type definition for CategoryCard props
type CategoryCardProps = {
  category: {
    name: string;
    imageSrc: string;
  };
};

// Component for a single category card
const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // The 'group' class is for potential hover effects later
  return (
    <div className="relative flex flex-col items-center justify-end p-0 group overflow-hidden">

      {/* Image Container */}
      <div className="relative w-full md:h-[400px] lg:h-[500px] bg-gray-900 overflow-hidden">
        <Image
          src={category.imageSrc}
          alt={category.name}
          width={400}
          height={400}
        />

        {/* Optional: Dark gradient overlay to make text pop against image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Category Name (The text beneath the image) */}


    </div>
  );
};

export default CategoryBanner;