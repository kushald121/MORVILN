"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SparklesText } from './sparkels';
import { useTheme } from 'next-themes';

const SQRT_5000 = Math.sqrt(5000);

const clothingItems = [
  // ... (clothingItems array remains unchanged)
  {
    tempId: 0,
    name: "Classic Denim Jacket",
    description: "Timeless design meets modern comfort",
    price: "$129",
    category: "Outerwear",
    brand: "Urban Threads",
    imgSrc: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop"
  },
  {
    tempId: 1,
    name: "Minimalist White Tee",
    description: "Essential wardrobe staple",
    price: "$45",
    category: "Basics",
    brand: "Pure Cotton Co.",
    imgSrc: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop"
  },
  {
    tempId: 2,
    name: "Tailored Black Blazer",
    description: "Professional elegance for any occasion",
    price: "$299",
    category: "Formal",
    brand: "Executive Style",
    imgSrc: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&fit=crop"
  },
  {
    tempId: 3,
    name: "Casual Cargo Pants",
    description: "Functional style with multiple pockets",
    price: "$89",
    category: "Bottoms",
    brand: "Street Wear",
    imgSrc: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=600&fit=crop"
  },
  {
    tempId: 4,
    name: "Vintage Leather Jacket",
    description: "Rock the timeless rebel look",
    price: "$399",
    category: "Outerwear",
    brand: "Rebel Leather",
    imgSrc: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop"
  },
  {
    tempId: 5,
    name: "Summer Floral Dress",
    description: "Light and breezy for warm days",
    price: "$79",
    category: "Dresses",
    brand: "Bloom Fashion",
    imgSrc: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop"
  },
  {
    tempId: 6,
    name: "Athletic Track Suit",
    description: "Performance meets street style",
    price: "$149",
    category: "Sportswear",
    brand: "Active Motion",
    imgSrc: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop"
  },
  {
    tempId: 7,
    name: "Knit Sweater",
    description: "Cozy warmth with modern texture",
    price: "$95",
    category: "Knitwear",
    brand: "Warm Vibes",
    imgSrc: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=600&fit=crop"
  },
  {
    tempId: 8,
    name: "High-Waisted Jeans",
    description: "Classic fit, contemporary style",
    price: "$119",
    category: "Denim",
    brand: "Blue Label",
    imgSrc: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=600&fit=crop"
  },
  {
    tempId: 9,
    name: "Linen Summer Shirt",
    description: "Breathable elegance for hot weather",
    price: "$69",
    category: "Shirts",
    brand: "Coastal Threads",
    imgSrc: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop"
  },
  {
    tempId: 10,
    name: "Wool Overcoat",
    description: "Sophisticated warmth for winter",
    price: "$449",
    category: "Outerwear",
    brand: "Heritage Coats",
    imgSrc: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=600&fit=crop"
  },
  {
    tempId: 11,
    name: "Graphic Print Hoodie",
    description: "Bold designs for bold personalities",
    price: "$75",
    category: "Streetwear",
    brand: "Art Threads",
    imgSrc: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop"
  },
  {
    tempId: 12,
    name: "Silk Evening Gown",
    description: "Luxurious elegance for special nights",
    price: "$599",
    category: "Evening Wear",
    brand: "Luxe Collection",
    imgSrc: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=600&fit=crop"
  },
  {
    tempId: 13,
    name: "Casual Chino Shorts",
    description: "Perfect for summer adventures",
    price: "$59",
    category: "Shorts",
    brand: "Summer Essentials",
    imgSrc: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=600&fit=crop"
  },
  {
    tempId: 14,
    name: "Bomber Jacket",
    description: "Aviation-inspired street style",
    price: "$189",
    category: "Jackets",
    brand: "Flight Club",
    imgSrc: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&fit=crop"
  },
  {
    tempId: 15,
    name: "Pleated Midi Skirt",
    description: "Feminine flow with every step",
    price: "$85",
    category: "Skirts",
    brand: "Grace & Flow",
    imgSrc: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=600&fit=crop"
  }
];

// ClothingCard component remains unchanged
interface ClothingCardProps {
  position: number;
  item: typeof clothingItems[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}


const ClothingCard: React.FC<ClothingCardProps> = ({
  position,
  item,
  handleMove,
  cardSize
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 overflow-hidden transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-card border-primary shadow-2xl"
          : "z-0 bg-muted border-border hover:border-primary/60 opacity-90"
      )}
      style={{
        width: cardSize,
        height: cardSize * 1.3,
        clipPath: `polygon(30px 0%, calc(100% - 30px) 0%, 100% 30px, 100% 100%, calc(100% - 30px) 100%, 30px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 10px 0px 5px rgba(30, 41, 59, 0.8)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-muted-foreground z-20"
        style={{
          right: -2,
          top: 28,
          width: SQRT_5000,
          height: 2
        }}
      />
      <div className="relative h-3/5 w-full overflow-hidden bg-muted">
        <Image
          width={400}
          height={600}
          src={item.imgSrc}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className={cn(
          "absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider",
          isCenter ? "bg-primary text-primary-foreground" : "bg-card/90 text-card-foreground"
        )}>
          {item.category}
        </div>
        <div className={cn(
          "absolute top-4 right-4 px-3 py-1 text-lg font-bold",
          isCenter ? "bg-primary text-primary-foreground" : "bg-card/90 text-card-foreground"
        )}>
          {item.price}
        </div>
      </div>
      <div className="p-6 h-2/5 flex flex-col justify-between">
        <div>
          <h3 className={cn(
            "text-lg sm:text-xl font-bold mb-2",
            isCenter ? "text-white" : "text-gray-300"
          )}>
            {item.name}
          </h3>
          <p className={cn(
            "text-sm mb-3",
            isCenter ? "text-gray-300" : "text-gray-400"
          )}>
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 italic">
            by {item.brand}
          </p>
          {isCenter && (
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Add to cart:', item.name);
              }}
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export const StaggerClothingShowcase: React.FC = () => {
  const [cardSize, setCardSize] = useState(340);
  const [clothingList, setClothingList] = useState(clothingItems);
  const [isPaused, setIsPaused] = useState(false);
  const { theme } = useTheme();

  const handleMove = useCallback((steps: number) => {
    setClothingList(currentList => {
      const newList = [...currentList];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = newList.shift();
          if (!item) return newList;
          newList.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = newList.pop();
          if (!item) return newList;
          newList.unshift({ ...item, tempId: Math.random() });
        }
      }
      return newList;
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      handleMove(1);
    }, 2000); // Move one card to the right every 1 seconds

    return () => clearInterval(intervalId);
  }, [isPaused, handleMove]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 340 : 280);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden from-slate-950 via-blue-950 to-slate-900 mt-20"
      style={{ height: 750 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-1/2 -translate-x-1/2 z-20 text-center">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-bold mb-5",
          theme === 'dark' ? "text-white" : "text-gray-900"
        )}>
          <SparklesText className={cn(
            'text-5xl',
            theme === 'dark' ? "text-white" : "text-gray-900"
          )} text="Featured Collection" />
        </h2>
      </div>

      {clothingList.map((item, index) => {
        const position = clothingList.length % 2
          ? index - (clothingList.length - 1) / 2
          : index - clothingList.length / 2;
        return (
          <ClothingCard
            key={item.tempId}
            item={item}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(-1)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 backdrop-blur-sm border-2 border-slate-600 text-white hover:bg-indigo-600 hover:border-indigo-600 shadow-lg hover:shadow-xl transition-all"
          aria-label="Previous item"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 backdrop-blur-sm border-2 border-slate-600 text-white hover:bg-indigo-600 hover:border-indigo-600 shadow-lg hover:shadow-xl transition-all"
          aria-label="Next item"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
        {clothingList.slice(0, 5).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              clothingList.findIndex((item, i) => i - (clothingList.length - 1) / 2 === 0) % 5 === idx
                ? "bg-indigo-600 w-6"
                : "bg-slate-600"
            )}
          />
        ))}
      </div>
    </div>
  );
};
