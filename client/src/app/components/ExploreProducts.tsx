'use client';

import {  useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Heart, Eye,  } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
// import SplashCursor from "./ui/splash-cursor";

gsap.registerPlugin(ScrollTrigger);

const ExploreProducts = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for product cards
      gsap.to(".explore-product-card", {
        y: "+=8",
        duration: 4,
        ease: "sine.inOut",
        stagger: {
          each: 0.15,
          from: "random"
        },
        repeat: -1,
        yoyo: true,
      });

      // Enhanced category button animations
      const categoryButtons = document.querySelectorAll('.category-button');
      categoryButtons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            y: -2,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const currentTheme = theme || resolvedTheme || 'dark';

  const categories = [
    'Accessories',
    'Best Deals',
    'Best Seller',
    'Chair',
    'Clothing',
    'Men\'s Collection',
  ];

  const products = [
    {
      id: 1,
      name: 'Ullamcorpe',
      price: '$259.00',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 2,
      name: 'Facilisis',
      price: '$149.00',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 3,
      name: 'Morbi pulvinar augue lorem',
      originalPrice: '$78.00',
      salePrice: '$49.00',
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 4,
      name: 'Aenean non pellentesque mauris',
      originalPrice: '$79.00',
      salePrice: '$57.00',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 5,
      name: 'Morbi varius ligula eget ante',
      originalPrice: '$95.00',
      salePrice: '$45.00',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 6,
      name: 'Nunc tempus facilisis',
      price: '$87.00',
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 7,
      name: 'Vestibulum ante ipsum primis',
      price: '$56.00',
      image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 8,
      name: 'Pellentesque dignissim sapien semper',
      price: '$78.00',
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 9,
      name: 'Fusce nec diam et dolor',
      originalPrice: '$79.00',
      salePrice: '$57.00',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    },
    {
      id: 10,
      name: 'Fusce congue cursus metus',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=250&h=250&fit=crop&crop=center',
      category: 'fashion'
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme === 'light' ? 'bg-white' : 'bg-background'}`}>
      {/* <SplashCursor /> */}
      {/* Payment Security Banner */}
      <div className={`${currentTheme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-card text-card-foreground'} py-8`}>
        <div className="container mx-auto px-4 flex items-center justify-center space-x-6">
          <span className={`text-sm font-bold ${currentTheme === 'light' ? 'text-gray-700' : 'text-foreground'}`}>Pay securely with</span>
          <div className="flex space-x-4">
            <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">P</div>
            <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center text-xs font-bold text-white">M</div>
            <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center text-xs font-bold text-white">V</div>
            <div className="w-8 h-6 bg-purple-600 rounded flex items-center justify-center text-xs font-bold text-white">A</div>
          </div>
        </div>
      </div>

      {/* Anniversary Sale Banner */}
      <div className={`${currentTheme === 'light' ? 'bg-blue-500 text-white' : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white'} py-8 relative overflow-hidden`}>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-2">🏷️ Anniversary Sale 🏷️</h1>
          <h2 className="text-3xl font-bold">EXPLORE THE PRODUCTS</h2>
        </div>
      </div>

      {/* Categories */}
      <div className={`${currentTheme === 'light' ? 'bg-gray-50' : 'bg-muted/30'} py-6`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                className={`category-button px-4 py-2 rounded-full border-2 transition-colors ${
                  currentTheme === 'light'
                    ? `border-gray-300 hover:border-blue-500 hover:bg-blue-50 ${index === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`
                    : `border-border hover:border-primary hover:bg-accent ${index === 0 ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground'}`
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className={`explore-product-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border group cursor-pointer ${
                currentTheme === 'light'
                  ? 'bg-white border-gray-200 hover:shadow-xl'
                  : 'bg-card border-border hover:shadow-lg'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative">
                <Image
                  width={250}
                  height={250}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay with action buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">
                    <motion.button
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-5 h-5 text-gray-700" />
                    </motion.button>
                    <motion.button
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </motion.button>
                  </div>
                </div>

                {product.originalPrice && (
                  <motion.div
                    className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  >
                    {Math.round((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.salePrice.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', '')) * 100)}%
                  </motion.div>
                )}

                {/* New badge for certain products */}
                {index % 3 === 0 && (
                  <motion.div
                    className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                  >
                    NEW
                  </motion.div>
                )}
              </div>

              <div className="p-4">
                <motion.h3
                  className={`text-sm font-medium mb-2 line-clamp-2 ${currentTheme === 'light' ? 'text-gray-900' : 'text-foreground'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {product.name}
                </motion.h3>

                <div className="flex items-center space-x-2 mb-3">
                  {product.originalPrice && (
                    <span className={`text-sm line-through ${currentTheme === 'light' ? 'text-gray-500' : 'text-muted-foreground'}`}>
                      {product.originalPrice}
                    </span>
                  )}
                  <motion.span
                    className={`font-bold ${product.originalPrice ? (currentTheme === 'light' ? 'text-blue-600' : 'text-primary') : (currentTheme === 'light' ? 'text-gray-900' : 'text-foreground')}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {product.salePrice || product.price}
                  </motion.span>
                </div>

                <motion.button
                  className={`w-full py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 ${
                    currentTheme === 'light'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreProducts;
