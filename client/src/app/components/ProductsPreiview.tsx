"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, ShoppingCart, Eye, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductService, Product } from "../services/productService";
// import SplashCursor from "./ui/splash-cursor";

gsap.registerPlugin(ScrollTrigger);

const Productspreiview = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Fetch products using ProductService
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to get featured products first
        try {
          const featuredProducts = await ProductService.getFeaturedProducts(8);
          if (featuredProducts && featuredProducts.length > 0) {
            setProducts(featuredProducts);
            return;
          }
        } catch {
          // If featured fails, get regular products
        }
        
        // Fallback to regular products
        const { products: allProducts } = await ProductService.getProducts({ limit: 8 });
        setProducts(allProducts || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for product cards
      gsap.to(".product-card", {
        y: "+=10",
        duration: 3,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          from: "random"
        },
        repeat: -1,
        yoyo: true,
      });

      // Parallax effect for the left banner
      gsap.to(".left-banner", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
            scrub: 1,
        },
        y: -50,
        rotation: "+=2",
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
    return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop';
  };

  // Calculate discount percentage
  const getDiscountAmount = (product: Product): number => {
    if (product.compare_at_price && product.compare_at_price > product.base_price) {
      return Math.round(product.compare_at_price - product.base_price);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen ">
      {/* <SplashCursor /> */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Explore Hot Products</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Banner */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative lg:col-span-1 overflow-hidden rounded-2xl shadow-lg left-banner"
          >
            <div className="aspect-[3/5.2] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_50%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.05),transparent_50%)]"></div>
              </div>

              {/* Model Image Placeholder */}
              <div className="w-full h-full flex items-center justify-center relative">
                <Image
                 src="https://www.oxanaalexphotography.com/wp-content/uploads/2023/04/modeling-poses-106-800x1024.jpg"
                 alt="Modeling poses"
                 fill
                 className="object-cover"
                 priority
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white"
                >
                  <h2 className="text-4xl lg:text-5xl font-bold mb-2 leading-tight text-gradient">
                    Summer<br />
                    Fashion
                  </h2>
                  <p className="text-white/80 text-lg mb-4">
                    Discover the latest trends
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Discount Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute top-6 right-6 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-lg"
              >
                20% off
              </motion.div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm border border-border animate-pulse">
                    <div className="aspect-[3/4] bg-muted"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-5 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>No products found</p>
              </div>
            ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {products.map((product) => {
                const productImage = getProductImage(product);
                const discount = getDiscountAmount(product);
                
                return (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-border product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-[3/4] bg-muted">
                    {/* Product Image */}
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-bold">
                        -₹{discount}
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-border"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(product.id)
                            ? "fill-destructive text-destructive"
                            : "text-muted-foreground"
                        }`}
                      />
                    </motion.button>

                    {/* Quick View Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-border"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  </div>

                  <div className="p-3">
                    <h3 className="font-medium text-foreground text-sm mb-1 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">
                        ₹{product.base_price.toFixed(2)}
                      </span>
                      {product.compare_at_price && product.compare_at_price > product.base_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
            )}
          </div>
        </div>

        {/* Product Quick View Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="fixed inset-0 bg-black/50 z-40"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-card rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
                  <div className="relative">
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="absolute top-4 right-4 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm z-10 border border-border text-foreground hover:bg-accent transition-colors"
                    >
                      ×
                    </button>

                    <div className="aspect-[3/4] bg-muted rounded-t-2xl relative">
                      <Image
                        src={getProductImage(selectedProduct)}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {selectedProduct.name}
                      </h3>
                      {selectedProduct.short_description && (
                        <p className="text-muted-foreground text-sm mb-3">
                          {selectedProduct.short_description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-foreground">
                          ₹{selectedProduct.base_price.toFixed(2)}
                        </span>
                        {selectedProduct.compare_at_price && selectedProduct.compare_at_price > selectedProduct.base_price && (
                          <span className="text-lg text-muted-foreground line-through">
                            ₹{selectedProduct.compare_at_price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleProductClick(selectedProduct)}
                          className="flex-1 bg-primary text-primary-foreground py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleWishlist(selectedProduct.id)}
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                            wishlist.includes(selectedProduct.id)
                              ? "bg-destructive text-destructive-foreground border-destructive"
                              : "border-border hover:border-destructive"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? "fill-current" : ""}`} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Productspreiview;
