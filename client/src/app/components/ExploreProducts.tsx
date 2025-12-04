'use client';

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductService, Product, Category } from "../services/productService";

gsap.registerPlugin(ScrollTrigger);

const ExploreProducts = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products using ProductService
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const filters: any = { limit: 10 };
        if (selectedCategory) {
          filters.category_id = selectedCategory;
        }
        
        const { products: fetchedProducts } = await ProductService.getProducts(filters);
        setProducts(fetchedProducts || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Fetch categories using ProductService
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await ProductService.getCategories();
        setCategories(fetchedCategories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  // Helper function to get primary image
  const getProductImage = (product: Product): string => {
    if (product.media && product.media.length > 0) {
      const primaryImage = product.media.find(m => m.is_primary);
      if (primaryImage) return primaryImage.media_url;
      return product.media[0].media_url;
    }
    return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=250&h=250&fit=crop';
  };

  // Calculate discount percentage
  const getDiscountPercent = (product: Product): number => {
    if (product.compare_at_price && product.compare_at_price > product.base_price) {
      return Math.round(((product.compare_at_price - product.base_price) / product.compare_at_price) * 100);
    }
    return 0;
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductClick = (product: Product) => {
    router.push(`/productpage/${product.slug || product.id}`);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Default categories if none fetched
  const displayCategories = categories.length > 0 
    ? categories.slice(0, 6) 
    : [
        { id: '1', name: 'All Products', slug: 'all' },
        { id: '2', name: 'Best Sellers', slug: 'best-sellers' },
        { id: '3', name: 'New Arrivals', slug: 'new-arrivals' },
      ];

  return (
    <div className={`min-h-screen `}>
      {/* <SplashCursor /> */}
      {/* Payment Security Banner */}
      <div className={` py-8`}>
        <div className="container mx-auto px-4 flex items-center justify-center space-x-6">
          <span className={`text-sm font-bold `}>Pay securely with</span>
          <div className="flex space-x-4">
            <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">P</div>
            <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center text-xs font-bold text-white">M</div>
            <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center text-xs font-bold text-white">V</div>
            <div className="w-8 h-6 bg-purple-600 rounded flex items-center justify-center text-xs font-bold text-white">A</div>
          </div>
        </div>
      </div>

      {/* Anniversary Sale Banner */}
      <div className={` py-8 relative overflow-hidden`}>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-2">🏷️ Anniversary Sale 🏷️</h1>
          <h2 className="text-3xl font-bold">EXPLORE THE PRODUCTS</h2>
        </div>
      </div>

      {/* Categories */}
      <div className={` py-6`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <motion.button
              className={`category-button px-4 py-2 rounded-full border-2 transition-colors ${
                selectedCategory === null ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-600 hover:border-primary'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
            >
              All Products
            </motion.button>
            {displayCategories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`category-button px-4 py-2 rounded-full border-2 transition-colors ${
                  selectedCategory === category.id ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-600 hover:border-primary'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="rounded-lg shadow-md overflow-hidden border animate-pulse bg-gray-800">
                <div className="w-full h-60 bg-gray-700" />
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-3" />
                  <div className="h-10 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product, index) => {
              const discountPercent = getDiscountPercent(product);
              const isInWishlist = wishlist.includes(product.id);
              
              return (
                <motion.div
                  key={product.id}
                  className={`explore-product-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border group cursor-pointer bg-gray-900 border-gray-700`}
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
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative">
                    <Image
                      width={250}
                      height={250}
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Overlay with action buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <motion.button
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isInWishlist ? 'bg-red-500 text-white' : 'bg-white/90'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                        >
                          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : 'text-gray-700'}`} />
                        </motion.button>
                        <motion.button
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                        >
                          <Eye className="w-5 h-5 text-gray-700" />
                        </motion.button>
                      </div>
                    </div>

                    {discountPercent > 0 && (
                      <motion.div
                        className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                      >
                        {discountPercent}% OFF
                      </motion.div>
                    )}

                    {/* Featured badge */}
                    {product.is_featured && (
                      <motion.div
                        className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                      >
                        FEATURED
                      </motion.div>
                    )}
                  </div>

                  <div className="p-4">
                    <motion.h3
                      className={`text-sm font-medium mb-2 line-clamp-2 text-white`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {product.name}
                    </motion.h3>

                    <div className="flex items-center space-x-2 mb-3">
                      {product.compare_at_price && product.compare_at_price > product.base_price && (
                        <span className={`text-sm line-through text-gray-500`}>
                          ₹{product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                      <motion.span
                        className={`font-bold text-white`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        ₹{product.base_price.toFixed(2)}
                      </motion.span>
                    </div>

                    <motion.button
                      className={`w-full py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add to cart functionality
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to cart
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreProducts;

