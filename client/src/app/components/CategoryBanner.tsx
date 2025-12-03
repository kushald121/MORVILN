import React from 'react';
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
  return (
    <section className="bg-black text-white py-12 px-4 md:px-8">
      
      {/* --- Category Grid --- */}
      <div className="w-full">
        <div className="grid grid-cols-5 w-full gap-0">
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
      <div className="relative w-full  md:h-[400px] lg:h-[500px] bg-gray-900 overflow-hidden">
        {/*
          IMPORTANT: Replace 'fill' and 'object-cover' with hardcoded width/height
          if your images aren't perfectly uniform, but 'fill' is best for responsive design.
          Set your Next.js 'images' config to allow these image domains/sizes.
          The image path MUST be correct relative to your 'public' folder or an external URL.
        */}
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